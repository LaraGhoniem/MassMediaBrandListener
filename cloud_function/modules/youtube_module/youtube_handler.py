import os
import youtube_dl
from pytube import YouTube
import yt_dlp

class Youtube:
    """Youtube Class for searching videos using keyword and returning links."""
    def __init__(self, channel_id):
        self.channel_id = channel_id
    
    def get_videos(self):
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
                    video_urls.append({"Link": f"https://www.youtube.com/watch?v={video['id']}", "title":video['title'], "ID":video["id"], "Publish Date": video.get("upload_date")})
        return video_urls
    
    def download(self, path):
        """Download videos using the link.
        \n`PATH` : A string representing the output path the video will be downloaded to."""
        path = os.path.join(path,self.channel_id)
        os.makedirs(path, exist_ok=True)
        urls = self.get_videos()
        for url in urls:
            try:
                # yt = YouTube(url["Link"])
                # video = yt.streams.filter(only_audio=True).first()
                # out_file = video.download(output_path=path)
                # new_file = url["ID"] + '.wav'
                # os.rename(out_file, os.path.join(path,new_file))
                dlp_options = {
                    'ignoreerrors': True,
                    'quiet': True,
                    'format': 'bestaudio/best',
                    'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'wav',
                        'preferredquality': '192',
                    }],
                }
                with yt_dlp.YoutubeDL(dlp_options) as ydl:
                    ydl.download([url["Link"]])
            except Exception as e:
                print(e)
                continue