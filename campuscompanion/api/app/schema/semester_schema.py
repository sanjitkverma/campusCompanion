from pydantic import BaseModel, Field
from app.schema.course_schema import Course
from typing import List

class Semester(BaseModel):
    courses: List[Course] = []
    type: str = Field(...)
    year: str = Field(...)
