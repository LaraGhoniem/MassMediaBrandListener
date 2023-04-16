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
        self.preprocessed_text = []
        self.data_array = []
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
                            self.preprocessed_text.append(temp[counter:])
                            self.data_array.append(data[i])
                else:
                    self.preprocessed_text.append(data[i]["text"])
                    self.data_array.append(data[i])
        # res = []
        # [res.append(x) for x in self.preprocessed_text if x not in res]
        # self.preprocessed_text = res

    def getResponse(self,lang):
        print(self.keyword)
        query_params = {
        'query': self.keyword + f' lang:{lang}',
        'max_results':'10',
        'tweet.fields': 'author_id,in_reply_to_user_id,entities,public_metrics,created_at,text,lang'
        }
        json_response = self.connect_to_endpoint(query_params)
        preprocessed_text = []
        self.tweet_data = []
        self.tweets_preprocessed_array = []
        counter = 0

        
        while json_response["meta"].get("next_token"):
            
            query_params["pagination_token"] = json_response["meta"]["next_token"]
            
            json_response = self.connect_to_endpoint(query_params)
            
            self.preprocessing(json_response["data"])

            self.tweet_data.extend(self.data_array)
            self.tweets_preprocessed_array.extend(self.preprocessed_text)
            if(counter== 50):
                break
            counter += 1

        return {"preprocessed_text": self.tweets_preprocessed_array, "tweet_data": self.tweet_data}
    
    def spamFilter(self,tweets):
        result = []
        for i in range(len(tweets)):
            result.append(self.spamDetector.predict(tweets[i])[0])
        return result
    
    def getLinksAndDates(self,tweets):
        result = []
        for tweet in tweets:
            result.append({"link": f"https://twitter.com/{tweet['author_id']}/status/{tweet['id']}", "date": tweet["created_at"]})
        return result

