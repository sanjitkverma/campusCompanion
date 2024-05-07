from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from app.schema.semester_schema import Semester
from app.schema.chatSession_schema import ChatSession
from app.schema.syllabus_schema import SyllabusModel
from bson import ObjectId


class User(BaseModel):
    unity_id: str = Field(...)
    student_id: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    chat_limit: int = Field(10, title="Chat Limit")
    academic_standing: str = Field(default="")
    credits: int = Field(default=0)
    career_type: str = Field(default="")
    minor: str = Field(default="")
    major: str = Field(default="")
    concentration: str = Field(default="")
    transcript: List[Semester] = []
    savedChats: List[ChatSession] = []
    syllabi: List[SyllabusModel] = []
