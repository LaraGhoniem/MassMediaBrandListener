from modules.database_module.database import Database
from classes.engine import Engine
from classes.listener import ObserverListener
from bson.objectid import ObjectId
from classes.user import User
import itertools


db = Database()

def get_listeners():
    """Retrieve all listeners from the database"""
    return [data for data in db.find("listeners", {})]

def get_keywords(listeners):
    """Retrieve keywords for each listener"""
    return [[data["keyword"] for data in db.find("keywords", {"listener_id":ObjectId(listener["_id"])})] for listener in listeners]

def get_categories(listeners):
    """Retrieve categories for each listener"""
    return [[[data for data in db.find("categories", {"_id":ObjectId(category_id)})] for category_id in listener["categories"]] for listener in listeners]

def get_users(listeners):
    """Retrieve users for each listener"""
    return [[User(data["_id"],data["name"],data["email"]) for data in db.find("users", {"_id":ObjectId(listener["user_id"])})] for listener in listeners]

def initialize_engine():
    """Initialize the engine with listeners, keywords, categories, and users"""
    engine = Engine()
    listeners = get_listeners()
    keywords = get_keywords(listeners)
    categories = get_categories(listeners)
    users = get_users(listeners)

    # Create ObserverListener objects and add them to the engine
    listeners = [ObserverListener(listener["_id"],listener["listener_name"],keywords[i],categories[i][0],users[i][0]) for i,listener in enumerate(listeners)]
    for listener in listeners:
        engine.addListener(listener)
    
    return engine

def update_database(engine):
    """Update the database with the new listener results"""
    for listener in engine.listeners:
        listener = list(itertools.chain(*listener.result))
        for result in listener:
            try:
                db.insert("results",result)
            except:
                continue

def main(event, context):
    """Main function to run the engine"""
    print("Engine is running")
    engine = initialize_engine()
    engine.run()
    update_database(engine)
    print("Engine ran successfully")

if __name__ == "__main__":
    main(None,None)