import os
from dotenv import load_dotenv
import requests
from newspaper import Article, ArticleException
from pyarabic import araby

class NewsScraper:
    def __init__(self):
        # Load environment variables from .env file
        dotenv_path = 'cloud_function/.env'
        load_dotenv(dotenv_path=dotenv_path)
        self.api_key = os.getenv('BING_API_KEY')
        self.endpoint = os.getenv('BING_ENDPOINT')

    @staticmethod
    def remove_hamza(text):
        hamza_forms = ['\u0623', '\u0625', '\u0622', '\u0624', '\u0626']
        for form in hamza_forms:
            text = text.replace(form, '\u0627')
        return text

    @staticmethod
    def download_article(url):
        """
        This function downloads and parses an article from the specified URL.

        :param url: The URL of the article to download.
        :return: The text of the article.
        """
        try:
            article = Article(url)
            article.download()
            article.parse()
            return article.text
        except ArticleException as e:
            return None

    def preprocess_text(self, text, keyword):
        """
        This function preprocesses the specified text by removing tashkeel and normalizing hamza.

        :param text: The text to preprocess.
        :param keyword: The keyword to search for in the text.
        :return: The preprocessed text.
        """
        # Remove tashkeel
        text = araby.strip_tashkeel(text)
        # Normalize hamza
        text = self.remove_hamza(text)
        keyword = self.remove_hamza(keyword)
        # Remove single and double newline characters
        text = text.replace('\n\n', ' ').replace('\n', ' ')

        return text

    def get_news_articles(self, keyword, markets):
        """
        This function retrieves news articles from the Bing News Search API and returns a list of articles that contain the specified keyword.

        :param keyword: The keyword to search for in the news articles.
        :param markets: A list of markets to search for in the news articles.
        :return: A list of dictionaries containing the URL, publish date, and text of each article.
        """
        result = []
        seen_news_ids = set()
        headers = {"Ocp-Apim-Subscription-Key": self.api_key}
        
        for market in markets:
            params = {"q": keyword, "count": 100, "mkt": market}
            response = requests.get(self.endpoint, headers=headers, params=params)
            response.raise_for_status()
            search_results = response.json()

            for url in search_results["value"]:
                if url['url'] not in seen_news_ids:
                    seen_news_ids.add(url['url'])
                    text = self.download_article(url["url"])
                    if text is not None:
                        preprocessed_text = self.preprocess_text(text, keyword)
                        result.append({"url": url["url"], "publishDate": url["datePublished"], "text": preprocessed_text})

        return result