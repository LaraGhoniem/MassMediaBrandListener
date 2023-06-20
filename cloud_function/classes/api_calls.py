# -*- coding: utf-8 -*-

from modules.twitter_module.twitter_api import TwitterAPI
from modules.sentiment_module.mazajak_api import Sentiment
from modules.news_module.news import NewsScraper
from modules.youtube_module.youtube_handler import Youtube
from modules.database_module.database import Database as db
from bson.objectid import ObjectId
from modules.asr_module.asr_handler import ASRModule
from modules.podcasts_module.DownloadMP3 import Podcasts
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from difflib import SequenceMatcher
from modules.summarization_module.summarization import Summarization


class ApiCall:
    def __init__(self, keyword, categories, listener_id):
        """
        Initializes an instance of the ApiCall class.

        :param keyword: The keyword to search for.
        :param categories: The category of the search.
        :param listener_id: The ID of the listener.
        """
        self.keyword = keyword
        self.categories = categories
        self.listener_id = listener_id
        # self.__twitter = TwitterAPI(keyword)
        self.__news = NewsScraper()
        self.__sentiment = Sentiment()
        self.__summarizer = Summarization()
    
    def send(self, youtube_results):
        """
        Retrieves data from Twitter and news sources using the keyword,
        processes the data, and stores the results in the result attribute.
        """
        with ThreadPoolExecutor() as executor:
            # twitter_future = executor.submit(self.get_twitter_data)
            news_future = executor.submit(self.get_news_data)
            # twitter_results = twitter_future.result()
            news_articles = news_future.result()

        print(self.categories)
        #get the _id id of the category in a new list
        category_ids = [category["_id"] for category in self.categories]

        youtube_results = [result for result in youtube_results if result["category_id"] in category_ids]
        self.result = self.process_data([], news_articles, youtube_results)

    def get_twitter_data(self):
        """
        Retrieves data from Twitter using the keyword.

        :return: A dictionary containing the Twitter data.
        """
        print("Twitter")
        twitter_results = self.__twitter.getResponse("ar")
        twitter_links_dates = self.__twitter.getLinksAndDates(twitter_results["tweet_data"])
        spam_twitter_results = self.__twitter.spamFilter(twitter_results["preprocessed_text"])
        sentiment_twitter_results = self.__sentiment.predict_list(twitter_results["preprocessed_text"])

        return {
            "links_dates": twitter_links_dates,
            "spam_results": spam_twitter_results,
            "sentiment_results": sentiment_twitter_results,
            "preprocessed_text": twitter_results["preprocessed_text"],
            "tweet_data": twitter_results["tweet_data"],
            "summary": "Text is too short to summarize."
        }
    def similarity_checker(self, a, b):
        result = SequenceMatcher(None, a, b).ratio()
        print(result)
        return result > 0.04
    
    def get_news_data(self):
        """
        Retrieves data from news sources using the keyword.

        :return: A list of dictionaries containing the news data.
        """
        print("News")
        news_articles = self.__news.get_news_articles(self.keyword, ["ar-EG", "ar-SA"])
        sentiment_news_results = self.__sentiment.predict_list([news["text"] for news in news_articles])
        summary_news_results = self.__summarizer.summarize_list([news["text"] for news in news_articles])
        return [{
            "text": news_articles[i]["text"],
            "sentiment": sentiment_news_results[i],
            "publishDate": news_articles[i]["publishDate"],
            "url": news_articles[i]["url"],
            "summary": summary_news_results
        } for i in range(len(news_articles))]
    
    def process_data(self, twitter_results, news_articles, youtube_results):
        """
        Processes the Twitter and news data and stores the results.

        :param twitter_results: A dictionary containing the Twitter data.
        :param news_articles: A list of dictionaries containing the news data.
        :return: A list of dictionaries containing the processed data.
        """
        # result = [{
        #     "listener_id": self.listener_id,
        #     "keyword": self.keyword,
        #     "source": "twitter",
        #     "text": twitter_results["preprocessed_text"][i],
        #     "tweet_data": twitter_results["tweet_data"][i],
        #     "sentiment": twitter_results["sentiment_results"][i],
        #     "spam": str(twitter_results["spam_results"][i]),
        #     "summary": "Summary not supported for twitter",
        #     "created_at": twitter_results["links_dates"][i]["date"],
        #     "link": twitter_results["links_dates"][i]["link"]
        # } for i in range(len(twitter_results["preprocessed_text"]))]

        result = []

        result += [{
            "listener_id": self.listener_id,
            "keyword": self.keyword,
            "source": "news",
            "text": news_articles[i]["text"],
            "sentiment": news_articles[i]["sentiment"],
            "summary": self.__summarizer.summarize(news_articles[i]["text"]),
            "created_at": news_articles[i]["publishDate"],
            "link": news_articles[i]["url"]
        } for i in range(len(news_articles))]

        for youtube_result in youtube_results:
            youtube_result["sentiment"] = []
            youtube_result["summary"] = self.__summarizer.summarize_list([youtube_single_video["text"] for youtube_single_video in youtube_result["text"]])
            for youtube_single_video in youtube_result["text"]:
                youtube_result["sentiment"].append(self.__sentiment.predict(youtube_single_video["text"]))

        for i in range(len(youtube_results)):
            for j in range(len(youtube_results[i]["text"])):
                similarity = self.similarity_checker(self.keyword, youtube_results[i]["text"][j]["text"])
                if similarity == True or self.keyword in youtube_results[i]["text"][j]["text"]:
                    result.append({
                        "listener_id": self.listener_id,
                        "keyword": self.keyword,
                        "source": "youtube",
                        "text": youtube_results[i]["text"][j]["text"],
                        "sentiment": youtube_results[i]["sentiment"][j],
                        "summary":  youtube_results[i]["text"][j]["text"].split(".")[0],
                        "created_at": datetime.now().strftime('%Y-%m-%d'),
                        "link": youtube_results[i]["text"][j]["link"]
                    })
        return result
    
    @staticmethod
    def get_youtube_podcast_text(youtube_links, podcast_links = []):
        """
        Retrieves the text from the YouTube videos.

        :param youtube_links: A list of YouTube video links.
        :param podcast_links: A list of podcast links.
        :return: A list of strings containing the text from the videos.
        """
        youtube_asr_result = []

        for link in youtube_links:
            # Youtube
            youtube = Youtube(link)
            links = youtube.get_videos()
            youtube.download("cloud_function/modules/youtube_module/downloads")
            ASR = ASRModule("cloud_function/modules/youtube_module/downloads", "cloud_function\modules\podcasts_module\PodcastsMP3")
            ASR.convert_audio()
            ASR.divide_audio()
            result = ASR.transcribe_audio()
            ASR.delete_audio_files()
            
            # join the results with the links
            for i in range(len(result)):
                try:
                    youtube_asr_result.append({"text": result[i], "link": links[i]["Link"]})
                except:
                    continue
        return youtube_asr_result
    
    @staticmethod
    def get_media_links_by_category_id(category_id):
        database = db()
        media_links = [data for data in database.find("media_link",{"category_id":ObjectId(category_id)})]
        return media_links
    