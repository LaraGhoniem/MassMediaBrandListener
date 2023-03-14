from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.twitter_module.twitter_api import TwitterAPI
from modules.news_module.news import NewsApi
from modules.youtube_module.youtube_handler import YouTube
from modules.asr_module.asr_handler import AsrHandler
from modules.sentiment_module import mazajak_api
from modules.database_module.database import Database
import itertools as IT
import json
from bson.objectid import ObjectId
from classes.user import User
from classes.listener import ObserverListener
from classes.engine import Engine
from pydantic import BaseModel
#python -m  uvicorn server:app --host 127.0.0.1 --port 80

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class JsonData(BaseModel):
    user_id: str
    listener_id: str
    name: str
    keywords: list
    category: str

    def toDict(self):
        return {
            "user_id": self.user_id,
            "listener_id": self.listener_id,
            "name": self.name,
            "keywords": self.keywords,
            "category": self.category
        }

#initialize database connection
db = Database()

#create Engine
engine = Engine()

# get all listeners from database
listeners = [data for data in db.find("listeners", {})]
# get all keywords from keywords collection using listeners ids
keywords = [[data["keyword"] for data in db.find("keywords", {"listener_id":ObjectId(listener["_id"])})] for listener in listeners]
# get categories from categories collection using listeners ids
categories = [[data for data in db.find("Category", {"_id":ObjectId(listener["category_id"])})] for listener in listeners]
# get all companies from companies collection using listeners ids
companies = [[data for data in db.find("companies", {"_id":ObjectId(listener["company_id"])})] for listener in listeners]
# get all users from users collection using company ids
users = [[User(data["_id"],data["name"],data["email"]) for data in db.find("users", {"_id":ObjectId(company[0]["user_id"])})] for company in companies]

#data["listener_id"],data["name"], data["keywords"], data["category"], user
listeners = [ObserverListener(listener["_id"],listener["listener_name"],keywords[i],categories[i][0]["_id"],users[i][0]) for i,listener in enumerate(listeners)]


@app.post("/listener/")
async def main(jsonData: JsonData):
    

    data = jsonData.toDict()

    #get user data from dict
    user_id = data["user_id"]
    result = [i for i in db.find("users",{"_id":ObjectId(user_id)})][0]
    user = User(user_id, result["name"],result["email"])

    # create listener
    listener = ObserverListener(data["listener_id"],data["name"], data["keywords"], data["category"], user)
    engine.addListener(listener)

    # start engine
    engine.run()
    
    # print(data)

    # update listener in database
    db.update("listeners", ObjectId(engine.listeners[0].id), {"listener_status":"active", "result":json.dumps(engine.listeners[0].result)})

    return "Done"
    



# @app.get("/search/")
# async def main(keyword: str):
#     # print(keyword)
#     if keyword != None or keyword != " ":
#         twitterAPI  = twitter_api.TwitterAPI(keyword)
#         myArr = twitterAPI.getResponse("ar")
#         SpamArray = twitterAPI.spamFilter(myArr)
#         # print(SpamArray)
#         twitter_sentimentArray = mazajak_api.predict_list(myArr)
        
#         articles=ARTICLESAPI(keyword)
#         art_array,art_titles_array = articles.article_search()
#         print(len(art_array))
#         art_sentimentArray = mazajak_api.predict_list(art_array)
#         # print(len(myArr))
#         # videos = youtube_handler.Youtube(keyword,"ar","EG",2)
#         # videos.download("youtube/downloads")
#         # asr = asr_handler.AsrHandler(keyword,"YouTube")
#         # asr.preprocess()
#         # asr.trim()
#         # youtube_asr_result = asr.transcribe()
#         # print(myArr)
        
#         # youtube_sentimentArray =  mazajak_api.predict_list(youtube_asr_result)
#         json = []
#         for text,sentiment,title in IT.zip_longest(art_array,art_sentimentArray,art_titles_array):
#             json.append({"text":text, "platform": "Articles", "sentiment":sentiment, "title":title})
#         for text,sentiment,spam in IT.zip_longest(myArr,twitter_sentimentArray,SpamArray):
#             json.append({"text":text, "platform": "Twitter", "sentiment":sentiment, "spam":str(spam)})
#         # for text,sentiment in IT.zip_longest(youtube_asr_result,youtube_sentimentArray):
#         #     json.append({"text":text, "platform": "YouTube", "sentiment":sentiment})
#         return json
#     else:
#         return ({"error":"keyword is empty"})