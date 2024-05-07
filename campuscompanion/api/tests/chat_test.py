import pytest
import pytest_asyncio
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from unittest.mock import AsyncMock
from fastapi import FastAPI, HTTPException
from main import app  # Adjust the import path according to your project structure
from llama_index.llms.types import MessageRole
from enum import Enum

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        yield ac

# @pytest_asyncio.fixture
# def mock_chat_engine(mocker):
#     mock = AsyncMock()
#     async def _mock_response_generator():
#         yield "Hello"
#         yield "How can I help you?"
#         # yield "End of message"  # Indicate the end of the stream for testing purposes
    
#     mock.astream_chat = AsyncMock(return_value=_mock_response_generator())
#     mocker.patch('app.engine.index.get_chat_engine', return_value=mock)
#     return mock

@pytest.mark.asyncio
async def test_chat_success(client, mock_chat_engine):
    chat_data = {
        "messages": [
            {"role": MessageRole.USER, "content": "Hello"},  # Assuming MessageRole.USER is an enum or similar
        ]
    }
    response = await client.post("/api/chat", json=chat_data)
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_chat_no_messages(client, mock_chat_engine):
    chat_data = {"messages": []}
    response = await client.post("/api/chat", json=chat_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "No messages provided"}

@pytest.mark.asyncio
async def test_chat_invalid_last_message(client, mock_chat_engine):
    chat_data = {
        "messages": [
            {"role": MessageRole.ASSISTANT, "content": "Hi, how can I help?"}  # Invalid last message
        ]
    }
    response = await client.post("/api/chat", json=chat_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Last message must be from user"}
