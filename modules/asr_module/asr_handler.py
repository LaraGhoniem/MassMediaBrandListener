#import library
import speech_recognition as sr
import librosa
from scipy.io import wavfile
from pydub import AudioSegment
import os
import subprocess
from ar_corrector.corrector import Corrector

class AsrHandler:
    """Handles the Audio Speech Recognition Syntax using the package: Speech Recognition"""
    def __init__(self, keyword, platform):
        self.YOUTUBE_DOWNLOADS_PATH = "modules/youtube_module/downloads"
        self.PODCASTS_DOWNLOADS_PATH = "modules/podcasts_module/PodcastsMP3"
        self.keyword = keyword
        self.platform = platform
        self.YOUTUBE_PREPROCESSED_DATA_PATH = "modules/asr_module/processed_audio_files/YouTube"
        self.YOUTUBE_TRIMMED_DATA_PATH = "modules/asr_module/result_trim/YouTube"
        self.PODCASTS_PREPROCESSED_DATA_PATH = "modules/asr_module/processed_audio_files/Podcasts"
        self.PODCASTS_TRIMMED_DATA_PATH = "modules/asr_module/result_trim/Podcasts"
    def preprocess(self):
        sourcepath = ""
        destpath = ""
        if self.platform == "YouTube":
            sourcepath = self.YOUTUBE_DOWNLOADS_PATH
            destpath = self.YOUTUBE_PREPROCESSED_DATA_PATH
        elif self.platform == "Podcasts":
            sourcepath = self.PODCASTS_DOWNLOADS_PATH
            destpath = self.PODCASTS_PREPROCESSED_DATA_PATH
        # radio
        for keyword in os.listdir(sourcepath):
            keywordPath = sourcepath + "/" + keyword
            destinationKeywordPath = destpath + "/" + keyword
            os.mkdir(destinationKeywordPath)
            for filename in os.listdir(keywordPath):
                src = keywordPath + "/" + filename
                dest = destinationKeywordPath + "/" + filename
                res = subprocess.Popen(f'ffmpeg -i {src} -ac 1 -ar 22050 {dest}',shell=True,stdout=subprocess.PIPE)
                res.stdout.read()
    def trim(self):
        """Trim videos to 1 minute length or fewer.\n
        \t`ID` : String of the ID of the keyword given
        """
        if self.platform == "YouTube":
            platform_source_path = self.YOUTUBE_PREPROCESSED_DATA_PATH 
        elif self.platform == "Podcasts":
            platform_source_path = self.PODCASTS_PREPROCESSED_DATA_PATH 
        for videos in os.listdir(platform_source_path):
            if self.platform == "YouTube":
                keywordPath = self.YOUTUBE_PREPROCESSED_DATA_PATH + "/" + videos
                trimmedPath = self.YOUTUBE_TRIMMED_DATA_PATH + "/" + videos
            elif self.platform == "Podcasts":
                keywordPath = self.PODCASTS_PREPROCESSED_DATA_PATH + "/" + videos
                trimmedPath = self.PODCASTS_TRIMMED_DATA_PATH + "/" + videos
            os.mkdir(trimmedPath)
            for video in os.listdir(keywordPath):
                length = librosa.get_duration(filename = (keywordPath + "/" +video))
                start = 0
                end = 60
                videoPath = trimmedPath + "/" + video
                os.mkdir(videoPath)
                sr,waveData = wavfile.read(keywordPath + "/" + video)
                if length < 60:
                    newPath = videoPath + "/0.wav"
                    wavfile.write(newPath,sr,waveData[0:int(sr*length)])
                    continue
                counter = 0
                while length > 0:
                    startSample = int(start*sr)
                    endSample = int(end*sr)
                    newPath = videoPath + "/" + str(counter) + ".wav"
                    wavfile.write(newPath,sr,waveData[startSample:endSample])
                    counter+=1
                    if(end != length):
                        start = end
                        if(end+60 >= length): end = length
                        else: end+=60
                    else: break
                    
    def  transcribe(self):
        r = sr.Recognizer()
        result = []
        if self.platform == "YouTube":
            platform_source_path = self.YOUTUBE_PREPROCESSED_DATA_PATH 
        elif self.platform == "Podcasts":
            platform_source_path = self.PODCASTS_PREPROCESSED_DATA_PATH
        
        for videos in os.listdir(platform_source_path):
            if self.platform == "YouTube":
                videosPath = self.YOUTUBE_TRIMMED_DATA_PATH + '/' + videos
            elif self.platform == "Podcasts":
                videosPath = self.PODCASTS_TRIMMED_DATA_PATH + '/' + videos
            for video in os.listdir(videosPath):
                videoPath = videosPath + "/" + video
                video_result = []
                for section in os.listdir(videoPath):
                    sectionPath = videoPath + "/" + section
                    with sr.AudioFile(sectionPath) as source:
                        audio_text = r.listen(source)
                        try:
                            text = r.recognize_google(audio_text,language="ar-AR")
                            video_result.append(text)
                        except:
                            continue
                if(" ".join(video_result).__contains__(self.keyword)):      
                    result.append(" ".join(video_result))
            return result
        
    def delete_all_folders(self):
        if self.platform == "YouTube":
            platform_source_path = self.YOUTUBE_PREPROCESSED_DATA_PATH 
        elif self.platform == "Podcasts":
            platform_source_path = self.PODCASTS_PREPROCESSED_DATA_PATH
        for videos in os.listdir(platform_source_path):
            if self.platform == "YouTube":
                videosPath = self.YOUTUBE_PREPROCESSED_DATA_PATH + '/' + videos
            elif self.platform == "Podcasts":
                videosPath = self.PODCASTS_PREPROCESSED_DATA_PATH + '/' + videos
            for video in os.listdir(videosPath):
                videoPath = videosPath + "/" + video
                os.remove(videoPath)
            os.rmdir(videosPath)

        if self.platform == "YouTube":
            platform_source_path = self.YOUTUBE_TRIMMED_DATA_PATH 
        elif self.platform == "Podcasts":
            platform_source_path = self.YOUTUBE_TRIMMED_DATA_PATH
        for videos in os.listdir(platform_source_path):
            if self.platform == "YouTube":
                videosPath = self.YOUTUBE_TRIMMED_DATA_PATH + '/' + videos
            elif self.platform == "Podcasts":
                videosPath = self.PODCASTS_TRIMMED_DATA_PATH + '/' + videos
            for video in os.listdir(videosPath):
                videoPath = videosPath + "/" + video
                for section in os.listdir(videoPath):
                    sectionPath = videoPath + "/" + section
                    os.remove(sectionPath)
                os.rmdir(videoPath)
            os.rmdir(videosPath)
