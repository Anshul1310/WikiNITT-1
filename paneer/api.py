from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app import get_chat_agent, get_retriever
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.documents import Document
import uvicorn
import json
import uuid

# ... (rest of imports)

# Data Models
class AdminDocument(BaseModel):
    id: str
    source_url: str
    title: str
    content: str
    type: str

class CrawlRequest(BaseModel):
    pages: int = 20

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}
print("Initializing Agent...")
try:
    llm_with_tools, tools = get_chat_agent()
    tools_map = {t.name: t for t in tools}
    print("Agent Initialized Successfully.")
except Exception as e:
    print(f"Failed to initialize agent: {e}")
    llm_with_tools = None
    tools_map = {}

SYSTEM_MESSAGE = SystemMessage(content="""You are WikiNITT, an intelligent and deep-thinking AI assistant for NIT Trichy.

CORE RESPONSIBILITIES:
1. **Deep Reasoning**: You MUST think step-by-step before answering. Enclose your thinking process in `<thinking>` tags.
2. **Multi-Step & Multi-Hop**: If a user asks a complex question, break it down. You can use the `search_nitt_data` tool multiple times.
    - E.g., "First I will search for X... then I will search for Y...".
3. **Use Retrieved Info**: If the `search_nitt_data` tool returns ANY information that is relevant to the user's query, USE IT.
4. **Citations**: ALWAYS cite your sources. When you use information from the `search_nitt_data` tool, the context will have a "Source: <url>" line. You must include these URLs in your response as markdown links.

PROCESS:
- **Phase 1: Thinking**: Start immediately with `<thinking>`. Analyze the request. Decide if you need tools.
- **Phase 2: Tool Execution**: If you need information, call `search_nitt_data`.
- **Phase 3: Refinement**: Analyze tool results in a new `<thinking>` block.
    - **CRITICAL**: If the tool returns "No results found" or similar, AND you have tried 1-2 plausible queries, **STOP**.
    - **PARTIAL DATA**: If a document looks like a fragment, a list, or a CV, **EXTRACT whatever facts you can**. Do not dismiss data just because it says "page 1 of 8" or looks cut off. If it mentions a name, a date, or a qualification, **USE IT**.
- **Phase 4: Final Answer**: Provide the final response to the user OUTSIDE the `<thinking>` tags.
""")

class ChatRequest(BaseModel):
    message: str
    session_id: str

async def chat_generator(user_input: str, session_id: str):
    if not llm_with_tools:
        yield json.dumps({"error": "Agent not initialized"}) + "\n"
        return

    if session_id not in sessions:
        sessions[session_id] = []

    chat_history = sessions[session_id]
    messages = [SYSTEM_MESSAGE] + chat_history + [HumanMessage(content=user_input)]
    
    try:
        while True:
            full_response = None
            
            # Stream Parsing State
            buffer = ""
            is_thinking = False
            
            for chunk in llm_with_tools.stream(messages):
                if full_response is None:
                    full_response = chunk
                else:
                    full_response += chunk
                
                content = chunk.content
                if content and isinstance(content, str):
                    buffer += content
                    
                    while True:
                        if is_thinking:
                            end_tag = "</thinking>"
                            if end_tag in buffer:
                                thought, rest = buffer.split(end_tag, 1)
                                yield json.dumps({"type": "thought_chunk", "content": thought}) + "\n"
                                buffer = rest
                                is_thinking = False
                            else:
                                # Check for partial end tag at the end
                                match_len = 0
                                for i in range(1, len(end_tag)):
                                    if buffer.endswith(end_tag[:i]):
                                        match_len = i
                                
                                if match_len > 0:
                                    to_yield = buffer[:-match_len]
                                    buffer = buffer[-match_len:]
                                    if to_yield:
                                        yield json.dumps({"type": "thought_chunk", "content": to_yield}) + "\n"
                                else:
                                    yield json.dumps({"type": "thought_chunk", "content": buffer}) + "\n"
                                    buffer = ""
                                break
                        else:
                            start_tag = "<thinking>"
                            if start_tag in buffer:
                                text, rest = buffer.split(start_tag, 1)
                                if text:
                                    yield json.dumps({"type": "text_chunk", "content": text}) + "\n"
                                buffer = rest
                                is_thinking = True
                            else:
                                # Check for partial start tag at the end
                                match_len = 0
                                for i in range(1, len(start_tag)):
                                    if buffer.endswith(start_tag[:i]):
                                        match_len = i
                                
                                if match_len > 0:
                                    to_yield = buffer[:-match_len]
                                    buffer = buffer[-match_len:]
                                    if to_yield:
                                        yield json.dumps({"type": "text_chunk", "content": to_yield}) + "\n"
                                else:
                                    yield json.dumps({"type": "text_chunk", "content": buffer}) + "\n"
                                    buffer = ""
                                break
            
            # Flush remaining buffer
            if buffer:
                if is_thinking:
                    yield json.dumps({"type": "thought_chunk", "content": buffer}) + "\n"
                else:
                    yield json.dumps({"type": "text_chunk", "content": buffer}) + "\n"

            messages.append(full_response)
            
            if full_response.tool_calls:
                if len(messages) > 30:
                    yield json.dumps({"type": "error", "content": "Max recursion limit reached."}) + "\n"
                    return

                for tool_call in full_response.tool_calls:
                    tool_name = tool_call["name"]
                    tool_args = tool_call["args"]
                    
                    if tool_name in tools_map:
                        yield json.dumps({"type": "status", "content": f"Searching: {tool_args.get('query', '...')}"}) + "\n"
                        
                        try:
                            # Execute tool
                            tool_result = tools_map[tool_name].invoke(tool_args)
                        except Exception as tool_err:
                            tool_result = f"Error executing tool: {tool_err}"
                        
                        messages.append(ToolMessage(
                            tool_call_id=tool_call["id"],
                            content=str(tool_result)
                        ))
                    else:
                        messages.append(ToolMessage(
                            tool_call_id=tool_call["id"],
                            content=f"Error: Tool '{tool_name}' not found."
                        ))
                continue
            
            else:
                sessions[session_id].append(HumanMessage(content=user_input))
                sessions[session_id].append(AIMessage(content=str(full_response.content)))
                break

    except Exception as e:
        print(f"Error processing chat: {e}")
        yield json.dumps({"type": "error", "content": str(e)}) + "\n"

@app.get("/admin/documents")
async def list_documents(page: int = 1, limit: int = 20):
    retriever = get_retriever()
    if not retriever:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
    
    docs = []
    store = retriever.docstore
    
    # Get all keys first (inefficient for large datasets but fine for <1000 docs)
    all_keys = list(store.yield_keys())
    total_docs = len(all_keys)
    
    # Calculate slice
    start = (page - 1) * limit
    end = start + limit
    sliced_keys = all_keys[start:end]
    
    if sliced_keys:
        # Batch get documents
        retrieved_docs = store.mget(sliced_keys)
        for i, doc in enumerate(retrieved_docs):
            if doc:
                docs.append(AdminDocument(
                    id=sliced_keys[i],
                    source_url=doc.metadata.get("source_url", ""),
                    title=doc.metadata.get("title", "Untitled"),
                    content=doc.page_content,
                    type=doc.metadata.get("content_type", "unknown")
                ))

    return {
        "items": docs,
        "total": total_docs,
        "page": page,
        "size": limit,
        "pages": (total_docs + limit - 1) // limit
    }

@app.post("/admin/documents")
async def add_document(doc: AdminDocument):
    retriever = get_retriever()
    if not retriever:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
    
    # If ID is not provided, generate one
    doc_id = doc.id if doc.id else str(uuid.uuid4())
    
    new_doc = Document(
        page_content=doc.content,
        metadata={
            "source_url": doc.source_url,
            "title": doc.title,
            "content_type": "manual"
        }
    )
    
    retriever.add_documents([new_doc], ids=[doc_id])
    return {"status": "success", "message": "Document added"}

@app.put("/admin/documents/{doc_id}")
async def update_document(doc_id: str, doc: AdminDocument):
    retriever = get_retriever()
    if not retriever:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
        
    store = retriever.docstore
    # Verify existence
    existing = store.mget([doc_id])[0]
    if not existing:
         raise HTTPException(status_code=404, detail="Document not found")
         
    # Create updated document. Preserve 'manual' type or update it.
    new_doc = Document(
        page_content=doc.content,
        metadata={
            "source_url": doc.source_url,
            "title": doc.title,
            "content_type": existing.metadata.get("content_type", "manual") 
        }
    )
    
    # In ParentDocumentRetriever, add_documents with same ID should obey the docstore update 
    # but the vector store part might duplicate child chunks if IDs aren't managed perfectly.
    # To be safe, we might ideally remove and read, but add_documents typically handles overwrites in KV store.
    # For vector store, it adds new chunks. Old chunks might remain as ghosts unless we delete first.
    
    # 1. Delete old (best effort)
    store.mdelete([doc_id]) 
    
    # 2. Add new
    retriever.add_documents([new_doc], ids=[doc_id])
    
    return {"status": "success", "message": "Document updated"}

@app.delete("/admin/documents/{doc_id}")
async def delete_document(doc_id: str):
    retriever = get_retriever()
    if not retriever:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
    
    store = retriever.docstore
    # Delete from docstore
    store.mdelete([doc_id])
    
    # Note: Deleting from VectorStore is harder because ParentDocumentRetriever 
    # doesn't expose a direct way to delete child chunks by parent ID easily 
    # without deeper access. For now, removing from Parent Store effectively 
    # breaks the retrieval link, or we can look into cleaning up orphans later.
    
    return {"status": "success", "message": "Document deleted"}

@app.post("/admin/crawl")
async def trigger_crawl(request: CrawlRequest):
    import subprocess
    try:
        # Run scrapy as a subprocess
        subprocess.Popen(
            ["scrapy", "crawl", "nitt", "-s", f"CLOSESPIDER_PAGECOUNT={request.pages}"],
            cwd="bablu" 
        )
        return {"status": "success", "message": "Crawl started in background"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(
        chat_generator(request.message, request.session_id), 
        media_type="application/x-ndjson"
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
