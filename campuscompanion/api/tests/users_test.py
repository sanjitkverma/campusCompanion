import pytest
import pytest_asyncio
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from fastapi import FastAPI
from main import app  # Assuming your FastAPI application is named `app` in `main.py`
from unittest.mock import patch, MagicMock
import datetime

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        yield ac

# Example of a test for the /login endpoint
@pytest.mark.asyncio
async def test_login_success(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return {"unity_id": "test_unity_id", "student_id": "12345", "first_name": "Test", "last_name": "User"}
    
    print(client)  # Check what this outputs during the test
    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/login", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert response.json() == {"unity_id": "test_unity_id", "student_id": "12345", "first_name": "Test", "last_name": "User"}

# Test for /updateCredits endpoint
@pytest.mark.asyncio
async def test_update_credits(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1
        return MockUpdateResult()
    
    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateCredits", headers={"X-SHIB_UID": "test_unity_id"}, json={"credits": 10})
    assert response.status_code == 200
    assert response.json() == {"message": "Credits updated successfully."}

# Test for /email endpoint with SendGrid API mock
@pytest.mark.asyncio
async def test_send_email(client, monkeypatch):
    monkeypatch.setattr("sendgrid.SendGridAPIClient.send", MagicMock(return_value=MagicMock(status_code=202)))

    response = await client.post("/api/users/email", json={
        "from_email": "test@example.com",
        "to_emails": "dest@example.com",
        "subject": "Test Email",
        "html_content": "<strong>Hello World</strong>"
    })
    assert response.status_code == 200

# Test for the /getTranscript endpoint
@pytest.mark.asyncio
async def test_get_transcript(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return {"unity_id": "test_unity_id", "transcript": [{"type": "Fall", "year": "2024", "courses": [{"code": "CSC", "number": "492", "name": "Senior Design", "grade": "A", "credits": "3"}]}]}

    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/getTranscript", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert "transcript" in response.json()

@pytest.mark.asyncio
async def test_get_transcript_not_found(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return None
    
    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)
    
    response = await client.get("/api/users/getTranscript", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

@pytest.mark.asyncio
async def test_get_saved_chats_success(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return {"unity_id": "test_unity_id", "savedChats": [{"chat_name": "Project", "messages": [{"sender_id": "user", "message": "sdc", "timestamp": "2024-04-15T15:06:50.866203"}]}]}

    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/getSavedChats", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert response.json() == {"savedChats": [{"chat_name": "Project", "messages": [{"sender_id": "user", "message": "sdc", "timestamp": "2024-04-15T15:06:50.866203"}]}]}

@pytest.mark.asyncio
async def test_get_chat_messages_success(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return {"unity_id": "test_unity_id", "savedChats": [{"chat_name": "Project", "messages": [{"sender_id": "user", "message": "sdc", "timestamp": "2024-04-15T15:06:50.866203"}]}]}

    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/getChatMessages/Project", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert response.json() == {"messages": [{"sender_id": "user", "message": "sdc", "timestamp": "2024-04-15T15:06:50.866203"}]}

@pytest.mark.asyncio
async def test_get_chat_messages_not_found(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return None

    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/getChatMessages/Project", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Chat not found."}

@pytest.mark.asyncio
async def test_update_credits_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1  # Indicates one document was matched and updated
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateCredits", headers={"X-SHIB_UID": "test_unity_id"}, json={"credits": 30})
    assert response.status_code == 200
    assert response.json() == {"message": "Credits updated successfully."}

@pytest.mark.asyncio
async def test_update_credits_not_found(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 0  # No documents matched for update
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateCredits", headers={"X-SHIB_UID": "test_unity_id"}, json={"credits": 30})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

@pytest.mark.asyncio
async def test_update_academic_standing_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateAcademicStanding", headers={"X-SHIB_UID": "test_unity_id"}, json={"academic_standing": "Good"})
    assert response.status_code == 200
    assert response.json() == {"message": "Academic standing updated successfully."}

@pytest.mark.asyncio
async def test_update_career_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateCareer", headers={"X-SHIB_UID": "test_unity_id"}, json={"career_type": "Engineering"})
    assert response.status_code == 200
    assert response.json() == {"message": "Career updated successfully."}

@pytest.mark.asyncio
async def test_get_current_user_success(client, monkeypatch):
    async def mock_find_one(*args, **kwargs):
        return {"unity_id": "test_unity_id", "academic_standing": "", "career_type":"", "chat_limit": 0, "concentration": "", "credits": 100, "student_id": "12345", "first_name": "Test", "last_name": "User", "major": "", "minor": "", "savedChats" : [], "transcript": []}

    monkeypatch.setattr("app.api.routers.users.users_collection.find_one", mock_find_one)

    response = await client.get("/api/users/current", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert response.json() == {"unity_id": "test_unity_id", "academic_standing": "", "career_type":"", "chat_limit": 0, "concentration": "", "credits": 100, "student_id": "12345", "first_name": "Test", "last_name": "User", "major": "", "minor": "", "savedChats" : [], "transcript": []}


@pytest.mark.asyncio
async def test_update_minor_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateMinor", headers={"X-SHIB_UID": "test_unity_id"}, json={"minor": "Mathematics"})
    assert response.status_code == 200
    assert response.json() == {"message": "Minor updated successfully."}

@pytest.mark.asyncio
async def test_update_minor_not_found(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 0
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateMinor", headers={"X-SHIB_UID": "test_unity_id"}, json={"minor": "Mathematics"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

@pytest.mark.asyncio
async def test_delete_chat_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            modified_count = 1
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.delete("/api/users/deleteChat/Project Meeting", headers={"X-SHIB_UID": "test_unity_id"})
    assert response.status_code == 200
    assert response.json() == {"message": "Chat deleted successfully."}

@pytest.mark.asyncio
async def test_update_major_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1  # Indicates one document was matched and updated
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateMajor", headers={"X-SHIB_UID": "test_unity_id"}, json={"major": "Computer Science"})
    assert response.status_code == 200
    assert response.json() == {"message": "Major updated successfully."}

@pytest.mark.asyncio
async def test_update_major_not_found(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 0  # No documents matched for update
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateMajor", headers={"X-SHIB_UID": "test_unity_id"}, json={"major": "Computer Science"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

@pytest.mark.asyncio
async def test_update_concentration_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateConcentration", headers={"X-SHIB_UID": "test_unity_id"}, json={"concentration": "Machine Learning"})
    assert response.status_code == 200
    assert response.json() == {"message": "Concentration updated successfully."}

@pytest.mark.asyncio
async def test_update_concentration_not_found(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 0
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    response = await client.put("/api/users/updateConcentration", headers={"X-SHIB_UID": "test_unity_id"}, json={"concentration": "Machine Learning"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

@pytest.mark.asyncio
async def test_update_transcript_success(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 1  # One document was successfully found and updated
            modified_count = 1  # The document was modified
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    transcript_data = {
        "transcript": [{"type": "Fall", "year": "2024", "courses": [{"code": "CSC", "number": "492", "name": "Senior Design", "grade": "A", "credits": "3"}]}]
    }
    response = await client.put("/api/users/updateTranscript", headers={"X-SHIB_UID": "test_unity_id"}, json=transcript_data)
    assert response.status_code == 200
    assert response.json() == {"message": "Transcript updated successfully."}

@pytest.mark.asyncio
async def test_update_transcript_user_not_found(client, monkeypatch):
    async def mock_update_one(*args, **kwargs):
        class MockUpdateResult:
            matched_count = 0  # No documents matched for update
            modified_count = 0  # Thus, no documents were modified
        return MockUpdateResult()

    monkeypatch.setattr("app.api.routers.users.users_collection.update_one", mock_update_one)

    transcript_data = {
        "transcript": [{"type": "Fall", "year": "2024", "courses": [{"code": "CSC", "number": "492", "name": "Senior Design", "grade": "A", "credits": "3"}]}]

    }
    response = await client.put("/api/users/updateTranscript", headers={"X-SHIB_UID": "test_unity_id"}, json=transcript_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}


@pytest.mark.asyncio
async def test_update_transcript_invalid_data(client):
    transcript_data = {
        "transcript": "incorrect_format"  # Incorrect format, should be a list of dictionaries
    }
    response = await client.put("/api/users/updateTranscript", headers={"X-SHIB_UID": "test_unity_id"}, json=transcript_data)
    assert response.status_code >= 400  # Expecting a client error, typically 422 Unprocessable Entity
