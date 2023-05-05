import requests
import os
from dotenv import load_dotenv
from modules.preprocessing_module.spam_detection.spam import Spam
import time


class TwitterAPI:
    def __init__(self,keyword):
        dotenv_path = 'cloud_function/.env'
        load_dotenv(dotenv_path=dotenv_path)
        self.TWITTER_BEARER_KEY = os.getenv("TWITTER_BEARER_KEY")
        self.bearer_token = os.environ.get("BEARER_TOKEN")
        self.url = os.getenv("TWITTER_ENDPOINT")
        self.keyword = keyword
        self.spamDetector = Spam()


    def bearer_oauth(self,r):
    # Setting the headers for the request.
        r.headers["Authorization"] = f"Bearer {self.TWITTER_BEARER_KEY}"
        r.headers["User-Agent"] = "v2TweetLookupPython"
        return r


    def connect_to_endpoint(self,params):
        response = requests.request("GET", self.url, auth= self.bearer_oauth, params=params)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()

    def preprocessing(self, data):
        self.preprocessed_text = []
        self.data_array = []
        seen_tweet_ids = set()
        for tweet in data:
            if tweet['id'] not in seen_tweet_ids:
                seen_tweet_ids.add(tweet['id'])
                if "entities" in tweet and "mentions" in tweet["entities"]:
                    text = tweet["text"]
                    counter = tweet["entities"]["mentions"][0]["end"]
                    if tweet["entities"]["mentions"][0]["start"] == 0:
                        for mention in tweet["entities"]["mentions"]:
                            if counter + 1 == mention["start"]:
                                counter = mention["end"]
                        if self.keyword in text[counter:]:
                            self.preprocessed_text.append(text[counter:])
                            self.data_array.append(tweet)
                else:
                    self.preprocessed_text.append(tweet["text"])
                    self.data_array.append(tweet)

    def getResponse(self, lang):
        query_params = {
            'query': self.keyword + f' lang:{lang}',
            'max_results': '10',
            'tweet.fields': 'author_id,in_reply_to_user_id,entities,public_metrics,created_at,text,lang'
        }
        try:
            json_response = self.connect_to_endpoint(query_params)
        except Exception as e:
            print('Rate limit exceeded. Sleeping for 15 minutes.')
            time.sleep(15 * 60)
            json_response = self.connect_to_endpoint(query_params)
        self.tweet_data = []
        self.tweets_preprocessed_array = []
        counter = 0

        while json_response["meta"].get("next_token"):
            query_params["pagination_token"] = json_response["meta"]["next_token"]
            json_response = self.make_request(query_params)
            try:
                self.preprocessing(json_response["data"])
                for tweet in self.data_array:
                    tweet.pop('text', None)
                    self.tweet_data.append(tweet)
                self.tweets_preprocessed_array.extend(self.preprocessed_text)
            except KeyError:
                print("KeyError: Data not found")
                continue
            if counter == 50:
                break
            counter += 1

        return {"preprocessed_text": self.tweets_preprocessed_array, "tweet_data": self.tweet_data}
    
    def make_request(self, query_params):
        try:
            json_response = self.connect_to_endpoint(query_params)
            return json_response
        except Exception as e:
            if 'Too Many Requests' in str(e):
                print('Rate limit exceeded. Sleeping for 15 minutes.')
                time.sleep(15 * 60)
                return self.make_request(query_params)
            else:
                raise e

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

