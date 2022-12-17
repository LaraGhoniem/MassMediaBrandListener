import requests
import os
import json
from api_keys import Keys

class TwitterAPI:
    def __init__(self):
        apiKeys = Keys()
        self.TWITTER_KEY = apiKeys.TWITTER_KEY
        self.TWITTER_SECRET_KEY = apiKeys.TWITTER_SECRET_KEY
        self.TWITTER_BEARER_KEY = apiKeys.TWITTER_BEARER_KEY
    bearer_token = os.environ.get("BEARER_TOKEN")


    def bearer_oauth(self,r):
    # Setting the headers for the request.
        r.headers["Authorization"] = f"Bearer {self.TWITTER_BEARER_KEY}"
        r.headers["User-Agent"] = "v2TweetLookupPython"
        return r


    def connect_to_endpoint(self,url,params):
        response = requests.request("GET", url, auth= self.bearer_oauth, params=params)
        # print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()

    def preprocessing(self,data, keyword):
        myArr = []
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
                        if(temp[counter:].__contains__(keyword)):
                            myArr.append(temp[counter:])
                else:
                    myArr.append(data[i]["text"])
        res = []
        [res.append(x) for x in myArr if x not in res]
        return res
