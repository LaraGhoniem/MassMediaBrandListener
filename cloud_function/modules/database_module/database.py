from pymongo import MongoClient
from dotenv import load_dotenv
import os

class Database(object):
    def __init__(self):
        """Initialize the database with the connection details."""
        dotenv_path = 'cloud_function/.env'
        load_dotenv(dotenv_path=dotenv_path)
        self.client = MongoClient(os.getenv("DATABASE_URL"))
        self.db = self.client["test"]

    def find(self, collection, query):
        """Find documents in a collection that match the given query."""
        return self.db[collection].find(query)

    def insert(self, collection, data):
        """Insert a single document into a collection."""
        return self.db[collection].insert_one(data)

    def insertAll(self, collection, data):
        """Insert multiple documents into a collection."""
        return self.db[collection].insert_many(data)

    def update(self, collection, id, data):
        """Update a single document in a collection."""
        self.db[collection].update_one({
            '_id': id,
        }, {
            '$set': data
        })

    def setUnique(self, collection, attribute):
        """Create a unique index on an attribute of a collection."""
        self.db[collection].create_index(attribute, unique=True)

    def delete(self, collection, query):
        """Delete a single document from a collection."""
        return self.db[collection].delete_one(query)

    def deleteAll(self, collection, query):
        """Delete multiple documents from a collection."""
        return self.db[collection].delete_many(query)