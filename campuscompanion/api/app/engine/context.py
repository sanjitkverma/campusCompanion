'''
Author: [Meles Meles]

A  file which contains the context for the RAG system..
'''

from llama_index import ServiceContext
from app.context import create_base_context
from app.engine.constants import CHUNK_SIZE, CHUNK_OVERLAP


def create_service_context():
    '''
    Creates a service context by combining the base context with default values.

    Returns:
        ServiceContext: The created service context.
    '''
    base = create_base_context()
    return ServiceContext.from_defaults(
        llm=base.llm, # language model
        embed_model=base.embed_model, # sentence embedding model
        chunk_size=CHUNK_SIZE, # number of characters in each chunk
        chunk_overlap=CHUNK_OVERLAP, # number of characters to overlap chunks
        node_parser=base.node_parser, # parser for the nodes
    )
