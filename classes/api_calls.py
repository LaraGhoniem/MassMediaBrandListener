from modules.twitter_module.twitter_api import TwitterAPI
from modules.sentiment_module import mazajak_api
from modules.news_module.news import NewsApi
from modules.youtube_module import youtube_handler
from modules.database_module.database import Database as db
from bson.objectid import ObjectId
from modules.asr_module import asr_handler


class ApiCall:
    def __init__(self, keyword, category):
        self.keyword = keyword
        self.category = category
        self.__twitter = TwitterAPI(keyword)
        self.__news = NewsApi(keyword)
        self.__sentiment = mazajak_api
    def send(self):
        # print("Youtube Downloading")
        #youtube results
        # media_links = self.get_media_links_by_category_id()
        # for media_link in media_links:
        #     youtube = youtube_handler.Youtube(media_link['media_link'])
        #     youtube.download("modules/youtube_module/downloads")
        # #asr results
        # asr = asr_handler.AsrHandler(self.keyword,"YouTube")
        # asr.preprocess()
        # asr.trim()
        # youtube_asr_result = asr.transcribe()
        # asr.delete_all_folders()
        # youtube_handler.Youtube.remove_files_from_dir("modules/youtube_module/downloads")
        
        print("Twitter")
        #twitter resuls
        twitter_results = self.__twitter.getResponse("ar")
        spam_twitter_results = self.__twitter.spamFilter(twitter_results)
        sentiment_twitter_results = self.__sentiment.predict_list(twitter_results)
        
        print("News")
        #articles results
        news_array,news_titles_array = self.__news.article_search()
        sentiment_news_results = self.__sentiment.predict_list(news_array)

        
        

        #"youtube": youtube_asr_result,
        self.result = {"twitter": {
            "text": twitter_results, 
            "sentiment" : sentiment_twitter_results, 
            "spam" : [str(i) for i in spam_twitter_results]
            }, 
            "news": {
                "text" : news_array,
                "title" : news_titles_array,
                "sentiment" : sentiment_news_results,
            }}
    def get_media_links_by_category_id(self):
        database = db()
        media_links = [data for data in database.find("media_link",{"category_id":ObjectId(self.category)})]
        return media_links
