import os
from dotenv import load_dotenv

load_dotenv()
from fastapi import APIRouter, HTTPException, Request, Response, Body, File, UploadFile, Depends, Form
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.schema.user_schema import User, SyllabusModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import BSONError
from app.schema.semester_schema import Semester
from app.schema.chatSession_schema import ChatSession
from app.schema.syllabus_schema import SyllabusModel
from typing import List
from pymongo.errors import DuplicateKeyError
import base64
import os

mongo_client = AsyncIOMotorClient(os.environ["MONGO_URI"])
db_name=os.environ["MONGODB_DATABASE"]
db = mongo_client[db_name]
users_collection = db[os.environ["MONGODB_USERS"]]
syllabi_collection = db[os.environ["MONGODB_SYLLABI"]]

users_router = r = APIRouter()

class EmailSchema(BaseModel):
    from_email: str
    to_emails: str
    subject: str
    html_content: str

def custom_encoder(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Add a new syllabus to the user's syllabi list
@r.post("/addSyllabus")
async def add_syllabus(request: Request, name: str = Form(...), file: UploadFile = File(...)):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    
    content = await file.read()
    base64_content = base64.b64encode(content).decode('utf-8')
    # Create a new syllabus object
    new_syllabus = SyllabusModel(name=name, content=base64_content).dict()
    # Add the new syllabus to the user's syllabi list
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$push": {"syllabi": new_syllabus}}
    )
    # If the user is not found, raise a 404 error
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "Syllabus added successfully."}

# Get all syllabi for the user
@r.get("/getSyllabus")
async def get_syllabi(request: Request):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Find the user in the database
    user = await users_collection.find_one({"unity_id": unity_id})
    # If the user is found, return the syllabi
    if user:
        return user.get("syllabi", [])
    raise HTTPException(status_code=404, detail="User not found")

# Delete a syllabus for the user
@r.delete("/deleteSyllabus/{syllabus_name}")
async def delete_syllabus(request: Request, syllabus_name: str):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Delete the syllabus from the user's syllabi list
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$pull": {"syllabi": {"name": syllabus_name}}}
    )
    # If the syllabus is not found, raise a 404 error
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Syllabus not found or user not found.")
    return {"message": "Syllabus deleted successfully."}

# This extracts the user's information from the headers and returns it
@r.get("/login")
async def read_root(request: Request):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")
    existing_user = await users_collection.find_one({"unity_id": unity_id})
    # If the user already exists, return the user's information
    if existing_user:
        existing_user_data = {k: custom_encoder(v) for k, v in existing_user.items()}
        return existing_user_data
    # If the user does not exist, create a new user
    user_data = {
        "unity_id": unity_id,
        "student_id": request.headers.get("X-SHIB-NCSU-CID"),
        "first_name": request.headers.get("X-SHIB-GIVENNAME"),
        "last_name": request.headers.get("X-SHIB-SN"),
    }
    # Insert the new user into the database
    user = User(**user_data)
    await users_collection.update_one({"unity_id": unity_id}, {"$set": user.dict()}, upsert=True)
    return {k: custom_encoder(v) for k, v in user.dict().items()}


# This endpoint returns the current user's information
@r.get("/current")
# This function reads the user's information from the headers and returns it
async def read_root(request: Request):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Find the user in the database
    user_document = await users_collection.find_one({"unity_id": unity_id})
    # If the user is not found, return a 404 error
    if user_document is None:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return the user's information
    user_data = User(**user_document)

    return user_data.dict()

# This endpoint sends an email using SendGrid
@r.post("/email")
async def send_email(email: EmailSchema = Body(...)) :
    # Create a new email message
    message = Mail(
        from_email=email.from_email,
        to_emails=email.to_emails,
        subject=email.subject,
        html_content = email.html_content
    )
    # Send the email using the SendGrid API
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class CreditsUpdate(BaseModel):
    credits: int = Field(..., title="Updated Credits Value", ge=0)
# Update the user's credits
@r.put("/updateCredits")
async def update_credits(request: Request, credits_update: CreditsUpdate):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Update the user's credits in the database
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"credits": credits_update.credits}}
    )
    # If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return a success message
    return {"message": "Credits updated successfully."}




class AcademicStandingUpdate(BaseModel):
    academic_standing: str = Field(..., title="Updated Academic Standing")
# Update the user's academic standing
@r.put("/updateAcademicStanding")
async def update_academic_standing(request: Request, academic_standing_update: AcademicStandingUpdate):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Update the user's academic standing in the database
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"academic_standing": academic_standing_update.academic_standing}}
    )
    # If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"message": "Academic standing updated successfully."}



class CareerUpdate(BaseModel):
    career_type: str = Field(..., title="Updated Career Type")
# Update the user's career type
@r.put("/updateCareer")
async def update_career(request: Request, career_update: CareerUpdate):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Update only the career_type field in MongoDB
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"career_type": career_update.career_type}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"message": "Career updated successfully."}



class MinorUpdate(BaseModel):
    minor: str = Field(..., title="Updated Minor")
# Update the user's minor
@r.put("/updateMinor")
async def update_minor(request: Request, minor_update: MinorUpdate):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Update only the minor field in MongoDB
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"minor": minor_update.minor}}
    )
    #  If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return a success message
    return {"message": "Minor updated successfully."}



class MajorUpdate(BaseModel):
    major: str = Field(..., title="Updated Major")
# Update the user's major
@r.put("/updateMajor")
async def update_major(request: Request, major_update: MajorUpdate):
    unity_id = request.headers.get("X-SHIB_UID")

    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Update only the major field in MongoDB
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"major": major_update.major}}
    )

    # If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"message": "Major updated successfully."}



class ConcentrationUpdate(BaseModel):
    concentration: str = Field(..., title="Updated Concentration")
# Update the user's concentration
@r.put("/updateConcentration")
async def update_concentration(request: Request, concentration_update: ConcentrationUpdate):
    # Get the Unity ID from the headers
    unity_id = request.headers.get("X-SHIB_UID")

    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Update only the concentration field in MongoDB
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"concentration": concentration_update.concentration}}
    )
    # If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return a success message
    return {"message": "Concentration updated successfully."}


class TranscriptUpdate(BaseModel):
    transcript: List[Semester]
# Update the user's transcript
@r.put("/updateTranscript")
async def update_transcript(request: Request, transcript_update: TranscriptUpdate):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Serialize the transcript object
    serialized_transcript = jsonable_encoder(transcript_update.transcript)

    # Update the transcript field in MongoDB
    result = await users_collection.update_one(
        {"unity_id": unity_id},
        {"$set": {"transcript": serialized_transcript }}
    )
    # If the user is not found, return a 404 error
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return a success message
    return {"message": "Transcript updated successfully."}


# Get the user's transcript
@r.get("/getTranscript")
async def get_transcript(request: Request):
    unity_id = request.headers.get("X-SHIB_UID")

    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Find the user in the database
    user_document = await users_collection.find_one({"unity_id": unity_id})
    # If the user is not found, return a 404 error
    if user_document is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Assuming the transcript is stored directly in the user document
    semesters = [Semester(**semester) for semester in user_document["transcript"]]

    # Return the user's transcript
    return {"transcript": semesters}


# Save a chat session for the user
@r.post("/saveChat")
async def save_chat(request: Request, chat_session: ChatSession = Body(...)):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Attempt to find a chat session with the same name for this user
    existing_session = await users_collection.find_one(
        {"unity_id": unity_id, "savedChats.chat_name": chat_session.chat_name}
    )
    # If a chat session with the same name exists, throw an error
    if existing_session:
        # If a chat session with the same name exists, throw an error
        raise HTTPException(status_code=400, detail="Chat session with this name already exists.")

    try:
        # The chat session does not exist, so add it to the user document
        await users_collection.update_one(
            {"unity_id": unity_id},
            {"$push": {"savedChats": chat_session.dict()}}
        )
        return {"message": "Chat saved successfully."}

    except DuplicateKeyError:
        raise HTTPException(status_code=500, detail="A chat session with this name already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    


class Chat(BaseModel):
    chat_name: str
    messages: List[str]

class UserChats(BaseModel):
    unity_id: str
    savedChats: List[Chat] = []

# Get all saved chat sessions for the user
@r.get("/getSavedChats")
async def get_saved_chats(request: Request):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Find the user in the database
    user_document = await users_collection.find_one({"unity_id": unity_id}, {"savedChats": 1})
    # If the user is not found, return a 404 error
    if user_document is None:
        raise HTTPException(status_code=404, detail="User not found.")
    # Return the user's saved chat sessions
    if "savedChats" in user_document and user_document["savedChats"]:
        return {"savedChats": user_document["savedChats"]}
    else:
        # No saved chats found, return a message
        return {"message": "No saved chats. Your saved chats will appear here."}
    

class Message(BaseModel):
    sender_id: str
    message: str
    timestamp: str

class Chat(BaseModel):
    chat_name: str
    messages: List[Message]

# Get Chat Messages for a specific chat
@r.get("/getChatMessages/{chat_name}")
async def get_chat_messages(request: Request, chat_name: str):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")

    # Query for the specific chat messages based on chat_name and unity_id
    chat_document = await users_collection.find_one(
        {"unity_id": unity_id, "savedChats.chat_name": chat_name},
        {"savedChats.$": 1}
    )
    #   If the chat is not found, return a 404 error
    if chat_document is None or not chat_document.get("savedChats"):
        raise HTTPException(status_code=404, detail="Chat not found.")
    # Return the chat messages
    messages = chat_document["savedChats"][0]["messages"]
    return {"messages": messages}



# Delete a chat based on the chat name
@r.delete("/deleteChat/{chat_name}")
async def delete_chat(request: Request, chat_name: str):
    unity_id = request.headers.get("X-SHIB_UID")
    # If the Unity ID is not found, return a 400 error
    if not unity_id:
        raise HTTPException(status_code=400, detail="Unity ID is required in the headers.")
    # Attempt to delete the specified chat session for this user
    try:
        # Attempt to delete the specified chat session for this user
        update_result = await users_collection.update_one(
            {"unity_id": unity_id},
            {"$pull": {"savedChats": {"chat_name": chat_name}}}
        )
        # If no chat session was found with the specified name, return a 404 error
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="No chat session found with the specified name.")
        # Return a success message
        return {"message": "Chat deleted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")