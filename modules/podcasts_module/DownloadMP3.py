from urllib.request import urlopen
from urllib.parse import urlparse
import codecs
import json
import os
import requests

# query=["كفاية بقى - Kefaya Ba2a","بودكاست علمي جدا"]
# query="Jordan Klepper Fingers the Conspiracy"
class Podcasts:
    data = {}
    podcast_title = ""
    podcast_id = ""
    podcast_url = ""
    categorizedlist = []
    keyword = ""
    region = ""
    # trackno = 0
    limit = 200
    id = 0
    #kan fi limit fel param unused w 3amla error
    def __init__(self,  region ,keyword = None,categorizedlist=None):
        if(self.categorizedlist==None and self.keyword==None):
            print("Error: No keyword or categorized list")
            return
        self.id += 1
        self.keyword = keyword
        self.region = region
        # self.limit = limit
        self.categorizedlist = categorizedlist
        # if(limit>200):
        #     self.limit=200
        
        
    def setpodcastdetails(self, jsondata):
            self.data = json.loads(jsondata.text);
            self.podcast_title = ((self.data.get("results"))[0].get("collectionName")).replace(" ", "_")
            self.podcast_url = (self.data.get("results"))[0].get("collectionViewUrl")
            # self.trackno = (self.data.get("results"))[0].get("trackCount")
            self.podcast_id = (self.data.get("results"))[0].get("collectionId")
    
    def getrss(self):
        ITUNES_URL = 'https://itunes.apple.com/lookup?id='
        parsed = urlparse(self.podcast_url)
        id = parsed.path.split('/')[-1][2:]
        reader = codecs.getreader('utf-8')
        with urlopen(ITUNES_URL + id) as response:
            return json.load(reader(response))['results'][0]['feedUrl']
        
    def getfinaldirectory(self):
        current_directory = os.getcwd()
        final_directory = os.path.join(current_directory+'\podcasts_module\PodcastsMP3\\'+str(self.keyword), r'')
        if not os.path.exists(final_directory):
            os.makedirs(final_directory)
        return final_directory[2:]
    
    def download(self):
        jsondata = requests.get('https://itunes.apple.com/search?term='+self.keyword+'&media=podcast&entity=podcast&country='+self.region+'&limit='+str(1))
        self.setpodcastdetails(jsondata)
        if(self.podcast_title==self.keyword.replace(" ", "_")):
            final_directory = self.getfinaldirectory()
            feed = self.getrss()
            os.system('cmd /k Podcasts\poddl.exe '+feed+' '+final_directory)

    # def downloadlist(self):
    #     for i in range(len(self.categorizedlist)):
    #         jsondata = requests.get('https://itunes.apple.com/search?term='+self.categorizedlist[i]+'&media=podcast&entity=podcast&country='+self.region+'&limit='+str(self.limit))
    #         self.setpodcastdetails(jsondata)
    #         if(self.podcast_title==self.categorizedlist[i].replace(" ", "_")):
    #             final_directory = self.getfinaldirectory()
    #             feed = self.getrss()
    #             os.system('cmd /k Podcasts\poddl.exe '+feed+' '+final_directory)
                
    def converttowav(self):
        current_directory = os.getcwd()
        final_directory = os.path.join(current_directory+'\podcasts_module\PodcastsMP3\\'+str(1), r'')
        if not os.path.exists(final_directory):
            os.makedirs(final_directory)
        count = 0
        for filename in os.listdir(final_directory):
            new_file = str(count) + '.wav'
            os.rename(os.path.join(final_directory,filename), os.path.join(final_directory,new_file))
            count += 1
    