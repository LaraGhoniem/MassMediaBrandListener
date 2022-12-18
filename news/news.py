import requests
from api_keys import Keys
apiKey = Keys()

from bs4 import BeautifulSoup

class ARTICLESAPI:
    def __init__(self,keyword):
        self.keyword=keyword
    def article_search(self):
        self.url = ('https://newsapi.org/v2/everything?'
                    'q='+self.keyword+'&'

                    'apiKey='+apiKey.news_api_key)
        content_array=[]
        response = requests.get(self.url)

        # print(response.json()["articles"][0]["content"])
        # Make an HTTP GET request to the URL
        for i in range(len(response.json()["articles"])):
         response = requests.get(response.json()["articles"][i]["url"])

        #Check the status code of the response
         try:
             if response.status_code == 200:
                # Successfully retrieved the webpage
                # Parse the HTML content
                soup = BeautifulSoup(response.text, "html.parser")
                # Extract the text of the article
                article_text = soup.get_text()
                content_array.append(article_text)
                print(article_text)
             else:
                # Could not retrieve the webpage
                print("Failed to retrieve webpage. Status code:", response.status_code)
         except:
             continue
        #  print(response.json())
articles=ARTICLESAPI("egypt")
articles.article_search()


