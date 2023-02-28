import requests
import os
import json
from api_keys import Keys
from modules.preprocessing_module.spam_detection.spam import Spam

class TwitterAPI:
    def __init__(self,keyword):
        apiKeys = Keys()
        self.TWITTER_KEY = apiKeys.TWITTER_KEY
        self.TWITTER_SECRET_KEY = apiKeys.TWITTER_SECRET_KEY
        self.TWITTER_BEARER_KEY = apiKeys.TWITTER_BEARER_KEY
        self.bearer_token = os.environ.get("BEARER_TOKEN")
        self.url = "https://api.twitter.com/2/tweets/search/recent"
        self.keyword = keyword
        self.spamDetector = Spam()


    def bearer_oauth(self,r):
    # Setting the headers for the request.
        r.headers["Authorization"] = f"Bearer {self.TWITTER_BEARER_KEY}"
        r.headers["User-Agent"] = "v2TweetLookupPython"
        return r


    def connect_to_endpoint(self,params):
        response = requests.request("GET", self.url, auth= self.bearer_oauth, params=params)
        # print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()

    def preprocessing(self,data):
        myArr = []
        # print(len(data))
        for i in range(len(data)):
            if("entities" in data[i].keys()):
                if("mentions" in data[i]["entities"].keys()):
                    temp = data[i]["text"]
                    counter = counter = data[i]["entities"]["mentions"][0]["end"]
                    j = 1
                    if(data[i]["entities"]["mentions"][0]["start"] == 0):
                        for j in range(len(data[i]["entities"]["mentions"])):
                            if(counter+1 == data[i]["entities"]["mentions"][j]["start"]):
                                counter = data[i]["entities"]["mentions"][j]["end"]
                        if(temp[counter:].__contains__(self.keyword)):
                            myArr.append(temp[counter:])
                else:
                    myArr.append(data[i]["text"])
        res = []
        [res.append(x) for x in myArr if x not in res]
        return res

    def getResponse(self,lang):
        print(self.keyword)
        query_params = {
        'query': self.keyword + f' lang:{lang}',
        'max_results':'10',
        'tweet.fields': 'author_id,in_reply_to_user_id,entities'
        }
        json_response = self.connect_to_endpoint(query_params)
        myArr = []
        counter = 1
        
        while json_response["meta"].get("next_token"):
            query_params["pagination_token"] = json_response["meta"]["next_token"]
            
            json_response = self.connect_to_endpoint(query_params)
            myArr += (self.preprocessing(json_response["data"]))
            counter+=1
            if counter == 20:
                break
        return myArr
    
    def spamFilter(self,tweets):
        result = []
        for i in range(len(tweets)):
            result.append(self.spamDetector.predict(tweets[i])[0])
        return result
