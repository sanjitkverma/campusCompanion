from typing import List, Optional, Any, Dict
from app.schema.semester_schema import Semester
from app.schema.chatSession_schema import ChatSession
from bson import ObjectId
from pydantic import BaseModel, Field

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError(f'Invalid ObjectId: {v}')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type='string')

class SyllabusModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias='_id')
    name: str
    content: str  # Assuming content is stored as a base64 string

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid)
        }