# Author: [Meles Meles]

"""
This module defines an API router for handling 
chat interactions using a FastAPI framework.
"""
from typing import List

from fastapi.responses import StreamingResponse
from llama_index.chat_engine.types import BaseChatEngine

from app.engine.index import get_chat_engine
from fastapi import APIRouter, Depends, HTTPException, Request, status
from llama_index.llms.base import ChatMessage
from llama_index.llms.types import MessageRole
from pydantic import BaseModel

# Define a FastAPI router for handling chat interactions
chat_router = r = APIRouter()

# Define aBaseModel class to represent a single message with role and content
class _Message(BaseModel):
    role: MessageRole
    content: str

# Define a BaseModel class to represent chat data containing a list of messages
class _ChatData(BaseModel):
    messages: List[_Message]

# Define an endpoint for handling chat requests using the POST method
@r.post("")
async def chat(
    request: Request,
    data: _ChatData,
    chat_engine: BaseChatEngine = Depends(get_chat_engine),
):
    """
    This function handles chat requests received through a POST request.

    Process"

    1. Precondition checks and message retrieval:
       - Checks if any messages were provided in the request data.
       - Raises a 400 Bad Request exception if no messages are found.
       - Extracts the last message from the provided list.
       - Raises a 400 Bad Request exception if the last message is not from the user role.

    2. Message conversion:
       - Iterates through the provided messages (excluding the last one).
       - Converts each message to a `ChatMessage` object with role and content fields.

    3. Querying the chat engine:
       - Calls the `astream_chat` method of the chat engine dependency (presumably retrieved from `get_chat_engine`).
       - Passes the last user message content and the converted message list as arguments.
       - Stores the response from the chat engine, which likely provides an asynchronous generator for chat responses.

    4. Streaming response:
       - Defines an asynchronous generator function `event_generator`.
       - Iterates through the asynchronous response generator obtained from the chat engine.
       - Yields each token (likely representing a chat response) from the engine.
       - Checks for client disconnection before yielding each token to avoid sending unnecessary data.

    5. Return streaming response:
       - Returns a `StreamingResponse` object using the defined `event_generator` function.
       - Sets the media type of the response to "text/plain" as the content is likely plain text chat responses.
    """
    # check preconditions and get last message
    if len(data.messages) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No messages provided",
        )
    lastMessage = data.messages.pop()
    if lastMessage.role != MessageRole.USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Last message must be from user",
        )
    # convert messages coming from the request to type ChatMessage
    messages = [
        ChatMessage(
            role=m.role,
            content=m.content,
        )
        for m in data.messages
    ]

    # query chat engine
    response = await chat_engine.astream_chat(lastMessage.content, messages)

    # stream response
    async def event_generator():
        async for token in response.async_response_gen():
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            yield token

    return StreamingResponse(event_generator(), media_type="text/plain")

   