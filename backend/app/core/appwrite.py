from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.query import Query
from appwrite.id import ID
from app.core.config import settings

client = Client()

if settings.APPWRITE_ENDPOINT:
    client.set_endpoint(settings.APPWRITE_ENDPOINT)

if settings.APPWRITE_PROJECT_ID:
    client.set_project(settings.APPWRITE_PROJECT_ID)

if settings.APPWRITE_API_KEY:
    client.set_key(settings.APPWRITE_API_KEY)

databases = Databases(client)
storage = Storage(client)

__all__ = ["client", "databases", "storage", "Query", "ID"]
