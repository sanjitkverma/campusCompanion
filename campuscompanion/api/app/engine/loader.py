# Author: [Meles Meles]

"""
This module defines functions for retrieving documents and potentially generating vector embeddings.
"""

import os
from app.engine.constants import DATA_DIR
from llama_index import VectorStoreIndex, download_loader
from llama_index import SimpleDirectoryReader
from llama_index import download_loader

def get_documents():
    """
    This function retrieves documents from a specified directory for processing 
    and potentially vectorization.

    **Process:**

    1. Downloads the `UnstructuredReader` class from the `llama_index` library using `download_loader`.
    2. Creates a `SimpleDirectoryReader` object to handle reading data from a directory structure.
        - `input_dir`: Sets the directory path containing the documents (obtained from `DATA_DIR`).
        - `file_extractor`: Defines a dictionary specifying how to extract content from different file extensions.
            - In this case, the `.html` extension uses the downloaded `UnstructuredReader` class for extraction.
    3. Calls the `load_data` method of the `dir_reader` object to load the documents from the specified directory.
    4. Returns the loaded documents.

    **Note:** The commented-out line provides an alternative approach using `SimpleDirectoryReader` directly, 
           but the current implementation leverages the downloaded `UnstructuredReader` for potentially 
           more specific HTML processing.
    """

    UnstructuredReader = download_loader("UnstructuredReader")
    dir_reader = SimpleDirectoryReader(
        input_dir=DATA_DIR,
        file_extractor={".html": UnstructuredReader()},
    )
    documents = dir_reader.load_data()

    # return SimpleDirectoryReader(DATA_DIR).load_data()
    return documents
