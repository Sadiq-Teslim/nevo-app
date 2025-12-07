import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client[os.getenv("DB_NAME", "default_db")]

# Helper to fix ObjectId serialization
def fix_id(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc