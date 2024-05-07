from pydantic import BaseModel, Field
from typing import List, Optional
from app.schema.message_schema import Message

class ChatSession(BaseModel):
    chat_name: str = Field(..., title="Name of the chat session")
    messages: List[Message] = []