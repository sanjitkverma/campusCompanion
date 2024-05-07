# Author: [Meles Meles]

"""
This script generates a datasource containing vector embeddings 
and stores them in a MongoDB collection.

Important Note: After running this script, you need to manually 
create a vector search index in MongoDB's UI for querying the data.
"""
from dotenv import load_dotenv

load_dotenv()
import os
import logging
from llama_index.vector_stores import MongoDBAtlasVectorSearch

from app.engine.constants import DATA_DIR
from app.engine.context import create_service_context
from app.engine.loader import get_documents


from llama_index import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


def generate_datasource(service_context):
    """
    This function generates a datasource containing vector embeddings 
    and stores them in a MongoDB collection.

    Arguments:

    service_context (object): An object containing service context information.

    Process:

    1. Logs a message indicating the creation of a new index.
    2. Loads documents using the `get_documents` function.
    3. Creates a `MongoDBAtlasVectorSearch` object with connection details from environment variables.
    4. Creates a `StorageContext` object using the MongoDB vector store.
    5. Calls `VectorStoreIndex.from_documents` to generate vector embeddings 
       from the loaded documents and stores them in the specified MongoDB collection.
       - `service_context`: The service context object passed as an argument.
       - `storage_context`: The storage context object created earlier.
       - `show_progress=True`: Enables a progress bar during embedding creation.
    6. Logs a message indicating successful creation of embeddings in the MongoDB collection.
    7. Logs an important note reminding the user to manually create a vector search index 
       in MongoDB's UI for querying the data. Includes a reference link for guidance.

    Returns:

    None
    """
    logger.info("Creating new index")
    # load the documents and create the index
    documents = get_documents()
    store = MongoDBAtlasVectorSearch(
        db_name=os.environ["MONGODB_DATABASE"],
        collection_name=os.environ["MONGODB_VECTORS"],
        index_name=os.environ["MONGODB_VECTOR_INDEX"],
    )
    storage_context = StorageContext.from_defaults(vector_store=store)
    VectorStoreIndex.from_documents(
        documents,
        service_context=service_context,
        storage_context=storage_context,
        show_progress=True,  # this will show you a progress bar as the embeddings are created
    )
    logger.info(
        f"Successfully created embeddings in the MongoDB collection {os.environ['MONGODB_VECTORS']}"
    )
    logger.info(
        """IMPORTANT: You can't query your index yet because you need to create a vector search index in MongoDB's UI now.
See https://github.com/run-llama/mongodb-demo/tree/main?tab=readme-ov-file#create-a-vector-search-index"""
    )


if __name__ == "__main__":
    generate_datasource(create_service_context())
