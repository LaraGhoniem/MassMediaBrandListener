from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Twitter_API import twitter_api
from youtube import youtube_handler
from ASR_Model import asr_handler
from sentiment_analysis_handler import mazajak_api
import itertools as IT
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/{keyword}")
async def main(keyword):
    print(keyword)
    if keyword != None:
        # twitterAPI  = twitter_api.TwitterAPI()
        # query_params = {
        # 'query': keyword + ' lang:ar',
        # 'max_results':'10',
        # 'tweet.fields': 'author_id,in_reply_to_user_id,entities'
        # }
        # search_url = "https://api.twitter.com/2/tweets/search/recent"
        # # json_response = twitterAPI.connect_to_endpoint(search_url,query_params)
        # # print((json_response["data"][0]["text"]))
        # counter = 1
        # # print(json.dumps(json_response, indent=4, sort_keys=True))
        # # print(coun)
        
        # myArr = []
        # while json_response["meta"].get("next_token"):
        #     query_params["pagination_token"] = json_response["meta"]["next_token"]
        #     json_response = twitterAPI.connect_to_endpoint(search_url,query_params)
        #     # print(type(json_response))
        #     # print((json_response["data"][0]["entities"]))
        #     myArr += (twitterAPI.preprocessing(json_response["data"],keyword))
        #     # print(json.dumps(json_response, indent=4, sort_keys=True))
        #     counter+=1
            # print(counter)
            # if(counter == 20):
            #     break
        videos = youtube_handler.Youtube(keyword,"ar","EG",2)
        videos.download("youtube/downloads")
        asr = asr_handler.AsrHandler(keyword,"YouTube")
        asr.preprocess()
        asr.trim()
        youtube_asr_result = asr.transcribe()
        # twitter_sentimentArray = mazajak_api.predict_list(myArr)
        youtube_sentimentArray =  mazajak_api.predict_list(youtube_asr_result)
        json = []
        # for text,sentiment in IT.zip_longest(myArr,twitter_sentimentArray):
        #     json.append({"text":text, "platform": "Twitter", "sentiment":sentiment})
        for text,sentiment in IT.zip_longest(youtube_asr_result,youtube_sentimentArray):
            json.append({"text":text, "platform": "YouTube", "sentiment":sentiment})
        return json
    # else:
    #     return ({"error":"keyword is empty"})