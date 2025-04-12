import os
from pymongo import MongoClient
from dotenv import load_dotenv
    
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set.")

client = MongoClient(MONGODB_URI)

db = client["finance"]

