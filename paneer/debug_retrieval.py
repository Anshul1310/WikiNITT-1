
import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_classic.storage import LocalFileStore
from langchain_classic.retrievers.parent_document_retriever import ParentDocumentRetriever
from langchain_text_splitters import RecursiveCharacterTextSplitter

DB_DIRECTORY = "bablu/nitt_vector_db"
PARENT_STORE_DIRECTORY = "bablu/nitt_parent_store"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def debug_db():
    print(f"Checking directories...")
    print(f"DB Exists: {os.path.exists(DB_DIRECTORY)}")
    print(f"Parent Store Exists: {os.path.exists(PARENT_STORE_DIRECTORY)}")

    print("\nLoading Embedding Model...")
    embedding_function = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    print(f"Loading Vector DB from {DB_DIRECTORY}...")
    vector_db = Chroma(
        persist_directory=DB_DIRECTORY, 
        embedding_function=embedding_function,
        collection_name="nitt_data"
    )
    
    print(f"Collection count: {vector_db._collection.count()}")
    
    # Try a simple similarity search directly on Vector DB
    print("\nTesting Similarity Search (Vector DB Only)...")
    results = vector_db.similarity_search("Jitraj Saha", k=3)
    print(f"Found {len(results)} chunks.")
    for i, doc in enumerate(results):
        print(f"--- Chunk {i} ---")
        print(doc.page_content[:200])
        print(doc.metadata)

    print(f"\nLoading Parent Store from {PARENT_STORE_DIRECTORY}...")
    
    from langchain_classic.storage import create_kv_docstore
    from langchain_classic.storage import LocalFileStore

    fs_store = LocalFileStore(PARENT_STORE_DIRECTORY)
    store = create_kv_docstore(fs_store)
    
    # Check keys in store (using the underlying fs_store for raw keys)
    keys = list(fs_store.yield_keys())
    print(f"Parent Store Keys count: {len(keys)}")
    
    child_splitter = RecursiveCharacterTextSplitter(chunk_size=256, chunk_overlap=32)
    parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)

    print("\nInitializing ParentDocumentRetriever...")
    retriever = ParentDocumentRetriever(
        vectorstore=vector_db,
        docstore=store,
        child_splitter=child_splitter,
        parent_splitter=parent_splitter,
    )
    
    print("\nTesting ParentDocumentRetriever...")
    try:
        docs = retriever.invoke("Jitraj Saha")
        print(f"Retriever found {len(docs)} documents.")
        for i, doc in enumerate(docs):
            print(f"--- Doc {i} ---")
            print(doc.page_content)
            print(doc.metadata)
    except Exception as e:
        print(f"Retriever Error: {e}")

if __name__ == "__main__":
    debug_db()
