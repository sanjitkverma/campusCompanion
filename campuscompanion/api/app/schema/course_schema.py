from pydantic import BaseModel, Field

class Course(BaseModel):
    code: str = Field(...)
    number: str = Field(...)
    name: str = Field(...)
    grade: str = Field(...)
    credits: str = Field(...)