import shutil
from youtubesearchpython import VideosSearch
import pytube as pt
from pytube import YouTube
import os
from uuid import uuid4
import youtube_dl

class Youtube:
    """Youtube Class for searching videos using keyword and returning links."""
    def __init__(self, channel_id):
        self.channel_id = channel_id
    
    def getVideos(self):
        """Get videos from channel."""
        playlist_url = f"https://www.youtube.com/{self.channel_id}/videos"
        ydl_opts = {
            'ignoreerrors': True,
            'quiet': True,
            'extract_flat': True,
            'skip_download': True,
            'format':"%(upload_date)s",
            'no_warnings': True,
            'simulate': True,
            'dump_single_json': True,
            'playlistend': 10,
            'extractor_args': ['--youtube-skip-dash-manifest'],
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            data = ydl.extract_info(playlist_url, download=False)
            video_urls = []
            for video in data['entries']:
                duration = video['duration']
                if int(duration) <= 2500:
                    video_urls.append({"Link": f"https://www.youtube.com/watch?v={video['id']}", "title":video['title'], "ID":video["id"]})
        return video_urls
    
    def download(self, path):
        """Download videos using the link.
        \n`PATH` : A string representing the output path the video will be downloaded to."""
        path = os.path.join(path,self.channel_id)
        os.mkdir(path)
        self.urls = self.getVideos()
        for url in self.urls:
            try:
                yt = YouTube(url["Link"])
                video = yt.streams.filter(only_audio=True).first()
                out_file = video.download(output_path=path)
                new_file = url["ID"] + '.wav'
                os.rename(out_file, os.path.join(path,new_file))
            except Exception as e:
                print(e)
                continue
    @staticmethod
    def remove_files_from_dir(folder):
        for source in os.listdir(folder):
            source = os.path.join(folder, source)
            if os.path.isfile(source):
                os.remove(source)
            elif os.path.isdir(source):
                shutil.rmtree(source)