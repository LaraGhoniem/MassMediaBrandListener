import requests
from api_keys import *
import json
from modules.preprocessing_module.Preprocess import Preprocess
apiKey = Keys()

from bs4 import BeautifulSoup

class NewsApi:
    def __init__(self,keyword):
        self.keyword=keyword
        self.preprocessing = Preprocess()
    def article_search(self):
        self.url = ('https://newsapi.org/v2/everything?'
                    'q='+self.keyword+'&'
                    'apiKey='+apiKey.news_api_key+'&language=ar')
        content_array=[]
        title_array=[]
        response = requests.get(self.url)
        data = json.loads(response.content)
        print(len(data["articles"]))
        for i in range(len(data["articles"])):
            try:
                response = requests.get(data["articles"][i]["url"])
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    article_text = soup.get_text()
                    content_array.append(article_text)
                    title_array.append(data["articles"][i]["title"])
                else:
                    print("Failed to retrieve webpage. Status code:", response.status_code)
            except:
                continue
        return content_array,title_array



