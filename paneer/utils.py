
import os
import re
import json
import logging
from langchain_groq import ChatGroq

class RagProcessor:
    def __init__(self, api_keys):
        self.api_keys = api_keys
        self.current_key_idx = 0
        if not api_keys:
            # Fallback for when initialized without keys (e.g. from env)
            env_keys = os.getenv("GROQ_API_KEYS")
            if env_keys:
                 self.api_keys = json.loads(env_keys) if isinstance(env_keys, str) and env_keys.startswith('[') else [env_keys]
            else:
                 self.api_keys = []
        
        self.llm = self._setup_llm()

    def _setup_llm(self):
        if not self.api_keys:
            return None
            
        current_key = self.api_keys[self.current_key_idx]
        return ChatGroq(
            api_key=current_key, 
            model_name="llama-3.1-8b-instant", 
            temperature=0,
            max_retries=0
        )

    def _call_llm_safe(self, prompt):
        """Executes LLM call with Automatic Key Rotation."""
        if not self.llm:
            raise ValueError("LLM not initialized. Check GROQ_API_KEYS.")

        max_attempts = len(self.api_keys) * 2 
        
        for attempt in range(max_attempts):
            try:
                return self.llm.invoke(prompt)
            except Exception as e:
                error_msg = str(e).lower()
                if "429" in error_msg or "rate_limit" in error_msg:
                    logging.warning(f"⚠️ Rate Limit hit on Key #{self.current_key_idx}. Rotating...")
                    self.current_key_idx = (self.current_key_idx + 1) % len(self.api_keys)
                    self.llm = self._setup_llm()
                    continue
                else:
                    raise e
        raise Exception("❌ ALL API keys are currently rate-limited or exhausted.")

    def create_audit_prompt(self, doc_text, url):
        return f"""
        Analyze this document from the NIT Trichy website.
        
        INPUT:
        URL: {url}
        CONTENT: {doc_text[:3500]}
        
        TASK:
        1. **Filter**: Discard if it is navigational junk, old tenders (<2023), or empty.
        2. **Rewrite**: If valid, rewrite the content into a clear, dense paragraph. 
           - **CRITICAL**: Include the Source URL and context (e.g., "According to the PhD regulations at [URL]...").
        3. **Questions**: Generate 3-5 potential questions that this document answers.
        
        OUTPUT format must be a strictly valid JSON (list of 1 object). 
        DO NOT include any explanation or markdown formatting. Output ONLY the raw JSON string.
        
        [
          {{
            "url": "{url}",
            "status": "keep", 
            "audience": "Student",
            "topic": "General",
            "rewritten_text": "The content summary...",
            "questions": ["Question 1?", "Question 2?"]
          }}
        ]
        """

    def parse_json_response(self, content):
        try:
            match = re.search(r'\[\s*\{.*\}\s*\]', content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            
            clean = content.strip()
            if clean.startswith("```json"):
                clean = clean.replace("```json", "").replace("```", "")
            return json.loads(clean)
        except Exception as e:
            logging.error(f"❌ JSON Parsing Failed: {e}")
            return []

    def process_document(self, text, url):
        """
        Runs the full audit/rewrite/question-generation pipeline on a single document.
        Returns the final processed text (Rewritten + Questions) or None if filtered out.
        """
        prompt = self.create_audit_prompt(text, url)
        response = self._call_llm_safe(prompt)
        audit_json = self.parse_json_response(response.content)
        
        if not audit_json:
            return None
            
        res = audit_json[0]
        if res.get("status") != "keep":
            return None
            
        content = res.get("rewritten_text", "")
        questions = res.get("questions", [])
        
        if questions:
            content += "\n\nPotential Questions:\n" + "\n".join([f"- {q}" for q in questions])
            
        return {
            "content": content,
            "metadata": {
                "source_url": url,
                "audience": res.get("audience", "General"),
                "topic": res.get("topic", "General")
            }
        }
