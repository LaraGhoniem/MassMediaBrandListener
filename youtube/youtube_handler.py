from youtubesearchpython import VideosSearch
import pytube as pt
from pytube import YouTube
import os
from uuid import uuid4

class Youtube:
    """Youtube Class for searching videos using keyword and returning links."""
    def __init__(self, keyword,language,region,limit):
        self.keyword = keyword
        self.id = str(uuid4())
        self._result = VideosSearch(self.keyword,language=language, region=region, limit = limit).result()["result"]
    def _parse(self):
        links = []
        for i in range(len(self._result)):
            links.append({"ID": str(uuid4()),"Link":self._result[i]["link"],"title":self._result[i]["title"]})
        return links
    def download(self, path):
        """Download videos using the link.
        \n`PATH` : A string representing the output path the video will be downloaded to."""
        path = os.path.join(path,self.id)
        os.mkdir(path)
        urls = self._parse()
        for url in urls:
            yt = YouTube(url["Link"])
            video = yt.streams.filter(only_audio=True).first()
            out_file = video.download(output_path=path)
            new_file = url["ID"] + '.wav'
            os.rename(out_file, os.path.join(path,new_file))