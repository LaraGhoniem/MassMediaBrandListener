from pymongo import MongoClient
from api_keys import Keys

class Database(object):
    def __init__(self):
        self.client = MongoClient("mongodb+srv://Cluster22:Mj8sP4uq8GtrOJBN@cluster22334.jy8xlkd.mongodb.net")
        self.db = self.client["test"]
    def find(self, collection, query):
        return self.db[collection].find(query)
    def insert(self, collection, data):
        return self.db[collection].insert_one(data)
    def insertAll(self, collection, data):
        return self.db[collection].insert_many(data)
    def update(self, collection, id, data):
        self.db[collection].update_one({
            '_id': id,
        }, {
            '$set': data
        })
    def setUnique(self, collection,attribute):
        self.db[collection].create_index(attribute, unique=True)
    

    def delete(self, collection, query):
        return self.db[collection].delete_one(query)
    def deleteAll(self, collection, query):
        return self.db[collection].delete_many(query)