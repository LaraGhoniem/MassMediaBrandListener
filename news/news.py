import requests
from api_keys import Keys
apiKey = Keys()
url = ('https://newsapi.org/v2/everything?'
       'q=محمد صلاح&'
       
       'apiKey='+apiKey.news_api_key)
response = requests.get(url)
print(response.json())
