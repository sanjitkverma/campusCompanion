import os

from llama_index import ServiceContext
from llama_index.llms import OpenAI
from llama_index.node_parser import SentenceWindowNodeParser
from app.engine.constants import SENTENCE_WINDOW_SIZE, TEMP
from llama_index.embeddings.openai import OpenAIEmbedding


embed_model = OpenAIEmbedding(
    model="text-embedding-3-small",
    embed_batch_size=100,
)

node_parser = SentenceWindowNodeParser.from_defaults(
        window_size=SENTENCE_WINDOW_SIZE,
        window_metadata_key="window",
        original_text_metadata_key="original_text",
    )

def create_base_context():
    model = os.getenv("MODEL", "gpt-3.5-turbo")
    return ServiceContext.from_defaults(
        embed_model=embed_model,
        llm=OpenAI(model=model, temperature=TEMP),
        node_parser=node_parser,
    )