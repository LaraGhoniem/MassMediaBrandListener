from modules.twitter_module.twitter_api import TwitterAPI
from modules.sentiment_module import mazajak_api
from modules.news_module.news import NewsApi
from modules.youtube_module import youtube_handler
from modules.database_module.database import Database as db
from bson.objectid import ObjectId
from modules.asr_module import asr_handler
from modules.podcasts_module.DownloadMP3 import Podcasts

class ApiCall:
    def __init__(self, keyword, category, listener_id):
        self.keyword = keyword
        self.category = category
        self.listener_id = listener_id
        self.__twitter = TwitterAPI(keyword)
        self.__news = NewsApi(keyword)
        self.__sentiment = mazajak_api
        self.__podcasts=Podcasts("EG",keyword)
    def send(self):
        # print("Youtube Downloading")
        # youtube results
        # media_links = self.get_media_links_by_category_id()
        # for media_link in media_links:
        #     if media_link['media_link_type'] == "youtube":
        #         youtube = youtube_handler.Youtube(media_link['media_link'])
        #         youtube.download("modules/youtube_module/downloads")
        # youtube_links = youtube.urls
        # #asr results
        # asr = asr_handler.AsrHandler(self.keyword,"YouTube")
        # asr.preprocess()
        # asr.trim()
        # youtube_asr_result = asr.transcribe()
        # youtube_sentiment_results = self.__sentiment.predict_list(youtube_asr_result)
        # asr.delete_all_folders()
        # youtube_handler.Youtube.remove_files_from_dir("modules/youtube_module/downloads")
        
        print("Twitter")
        #twitter resuls
        twitter_results = self.__twitter.getResponse("ar")
        twitter_links_dates = self.__twitter.getLinksAndDates(twitter_results["tweet_data"])
        spam_twitter_results = self.__twitter.spamFilter(twitter_results["preprocessed_text"])
        sentiment_twitter_results = self.__sentiment.predict_list(twitter_results["preprocessed_text"])
        
        print("News")
        #articles results
        news_array,news_titles_array,other_data = self.__news.article_search()
        sentiment_news_results = self.__sentiment.predict_list(news_array)

        # print("Podcasts")
        # # podcasts results
        # #3amalna media link lel podcasts hena badal el function
        # media_links = self.get_media_links_by_category_id()
        # for media_link in media_links:
        #     if media_link['media_link_type'] == "podcast":
        #         podcast = Podcasts("EG", media_link['media_link'])
        #         podcasts_titles_array=podcast.podcast_title
        #         podcast.download()
        #         podcast.converttowav()
        # asr = asr_handler.AsrHandler(self.keyword,"Podcasts")
        # asr.preprocess()
        # asr.trim()
        # Podcast_asr_result = asr.transcribe()
        # asr.delete_all_folders()

        # [listener_id, keyword, source, text,tweetData sentiment, spam, summary, created_at, link]
        #TWITTER
        self.result = [{
            "listener_id": self.listener_id,
            "keyword": self.keyword,
            "source": "twitter",
            "text": twitter_results["preprocessed_text"][i],
            "tweet_data": twitter_results["tweet_data"][i],
            "sentiment": sentiment_twitter_results[i],
            "spam": str(spam_twitter_results[i]),
            "summary": "summary",
            "created_at": twitter_links_dates[i]["date"],
            "link": twitter_links_dates[i]["link"]
        } for i in range(len(twitter_results["preprocessed_text"]))]

        #NEWS
        self.result += [{
            "listener_id": self.listener_id,
            "keyword": self.keyword,
            "source": "news",
            "text": news_array[i],
            "sentiment": sentiment_news_results[i],
            "summary": "summary",
            "created_at": other_data[i]["publishedAt"],
            "link": other_data[i]["url"]
        } for i in range(len(news_array))]

        # #YOUTUBE
        # self.result += [{
        #     "listener_id": self.listener_id,
        #     "keyword": self.keyword,
        #     "source": "youtube",
        #     "text": youtube_asr_result[i],
        #     "sentiment": youtube_sentiment_results[i],
        #     "summary": "summary",
        #     "created_at": "date",
        #     "link": youtube_links[i]
        # } for i in range(len(youtube_asr_result))]

        # self.result = {"twitter": {
        #     "text": twitter_results, 
        #     "sentiment" : sentiment_twitter_results, 
        #     "spam" : [str(i) for i in spam_twitter_results],
        #     "links_dates" : twitter_links_dates
        #     }, 
        #     "news": {
        #         "text" : news_array,
        #         "links" : [data["url"] for data in other_data],
        #         "publishedAt" : [data["publishedAt"] for data in other_data],
        #         "title" : news_titles_array,
        #         "sentiment" : sentiment_news_results,
        #     },
        #     "youtube": {
        #         "text" : youtube_asr_result,
        #         "sentiment" : self.__sentiment.predict_list(youtube_asr_result),
        #     },
        #     # , "podcasts": {
        #     #     "text" : Podcast_asr_result,
        #     #     "title" : podcasts_titles_array,
        #     #     "sentiment" : self.__sentiment.predict_list(Podcast_asr_result),
        #     # }
        #     }
    
    def get_media_links_by_category_id(self):
        database = db()
        media_links = [data for data in database.find("media_link",{"category_id":ObjectId(self.category)})]
        return media_links
