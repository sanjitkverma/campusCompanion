# Author: [Meles Meles]

"""
This script defines a function to connect to a vector search index stored in MongoDB
and create a chat engine instance from it.

The chat engine leverages sentence transformers for reranking retrieved results 
and incorporates metadata replacement for enhanced functionality.
"""

import logging
import os

from llama_index import (
    VectorStoreIndex,
)
from llama_index.vector_stores import MongoDBAtlasVectorSearch
from llama_index.indices.postprocessor import MetadataReplacementPostProcessor
from llama_index.indices.postprocessor import SentenceTransformerRerank


from app.engine.context import create_service_context


def get_chat_engine():
    """
    This function establishes a connection to a vector search index stored in MongoDB 
    and returns a chat engine instance built on top of it.

    Process:

    1. Creates a service context using the `create_service_context` function.
    2. Obtains a logger instance named "uvicorn" for logging messages.
    3. Logs a message indicating the start of connecting to the MongoDB index.
    4. Creates a `MongoDBAtlasVectorSearch` object with connection details from environment variables.
    5. Creates a `VectorStoreIndex` object from the MongoDB vector store and service context.
    6. Logs a message indicating successful connection to the MongoDB index.
    7. Logs a message about adding a reranker to the index.
    8. Creates a `MetadataReplacementPostProcessor` object to handle metadata replacement logic.
    9. Creates a `SentenceTransformerRerank` object for reranking retrieved results using the specified model.
    10. Configures the chat engine instance using the retrieved vector store index:
        - `similarity_top_k`: Sets the number of similar items to retrieve for each query.
        - `node_postprocessors`: Applies the created postprocessors (metadata replacement and reranking) to retrieved nodes.
        - `chat_mode`: Sets the chat mode to "condense_plus_context" for potentially condensing responses with context.
    11. Returns the constructed chat engine instance.
    """
    service_context = create_service_context()
    logger = logging.getLogger("uvicorn")
    logger.info("Connecting to index from MongoDB...")
    store = MongoDBAtlasVectorSearch(
        db_name=os.environ["MONGODB_DATABASE"],
        collection_name=os.environ["MONGODB_VECTORS"],
        index_name=os.environ["MONGODB_VECTOR_INDEX"],
    )
    index = VectorStoreIndex.from_vector_store(store, service_context)
    logger.info("Finished connecting to index from MongoDB.")
    logger.info("adding reranker to index...")
    postproc = MetadataReplacementPostProcessor(target_metadata_key="window")
    rerank = SentenceTransformerRerank(
            top_n=2, model="BAAI/bge-reranker-base"
        )
    return index.as_chat_engine(similarity_top_k=10, node_postprocessors=[postproc, rerank], chat_mode="condense_plus_context")
