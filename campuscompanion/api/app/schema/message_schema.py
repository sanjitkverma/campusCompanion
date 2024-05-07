from pydantic import BaseModel, Field
from app.schema.course_schema import Course
from datetime import datetime

class Message(BaseModel):
    sender_id: str = Field(...)
    message: str = Field(...)
    timestamp: datetime = Field(default_factory=datetime.now)