import math
import os
import subprocess
from pydub import AudioSegment
import speech_recognition as sr
from concurrent.futures import ThreadPoolExecutor
import shutil



class ASRModule:
    def __init__(self, audio_youtube, audio_podcast):
        self.audio_youtube = audio_youtube
        self.audio_podcast = audio_podcast

    def repair_wav_file(self, filepath):
        """
        Attempt to repair a corrupted WAV file using ffmpeg.
        """
        repaired_filepath = filepath.replace('.wav', '_repaired.wav')
        subprocess.call(['ffmpeg', '-y', '-i', filepath, '-c:a', 'flac', 'temp.flac'])
        subprocess.call(['ffmpeg', '-y', '-i', 'temp.flac', repaired_filepath])
        os.remove('temp.flac')
        return repaired_filepath
    
    def remove_unrepaired_files(self):
        for audio_path in [self.audio_youtube, self.audio_podcast]:
            for filename in os.listdir(audio_path):
                for medialink in os.listdir(os.path.join(audio_path, filename)):
                    filepath = os.path.join(os.path.join(audio_path, filename), medialink)
                    if '_repaired' not in filepath:
                        os.remove(filepath)

    def convert_audio(self, target_sample_rate=22050):
        """
        Convert audio files in the given paths to the target sample rate.
        """
        for audio_path in [self.audio_youtube, self.audio_podcast]:
            for filename in os.listdir(audio_path):
                for medialink in os.listdir(os.path.join(audio_path, filename)):
                    filepath = os.path.join(os.path.join(audio_path, filename), medialink)
                    repaired_filepath = self.repair_wav_file(filepath)
        self.remove_unrepaired_files()

    def divide_audio(self, target_length=60):
        """
        Divide audio files in the given paths into multiple parts of the target length (in seconds) if they have not already been divided.
        """
        for audio_path in [self.audio_youtube, self.audio_podcast]:
            for filename in os.listdir(audio_path):
                for medialink in os.listdir(os.path.join(audio_path, filename)):
                    try:
                        new_dir = os.path.join(os.path.join(audio_path, filename), medialink.split('.')[0])
                        if not os.path.exists(new_dir):
                            sound = AudioSegment.from_wav(os.path.join(os.path.join(audio_path, filename), medialink))
                            num_parts = math.ceil(len(sound) / (target_length * 1000))
                            os.makedirs(new_dir, exist_ok=True)
                            for i in range(num_parts):
                                start = i * target_length * 1000
                                end = min((i + 1) * target_length * 1000, len(sound))
                                part = sound[start:end]
                                part.export(os.path.join(new_dir, f'{medialink}_{i}.wav'), format="wav")
                            os.remove(os.path.join(os.path.join(audio_path, filename), medialink))
                    except Exception as e:
                        print(e)

    def transcribe_audio_file(self,audio_path, filename, medialink, audiofile):
        """
        Transcribe a single audio file using the speech_recognition package and return the transcribed text.
        """
        r = sr.Recognizer()
        try:
            with sr.AudioFile(os.path.join(os.path.join(os.path.join(audio_path, filename),medialink),audiofile)) as source:
                audio = r.record(source)
                text = r.recognize_google(audio, language='ar-EG')
                return text
        except Exception as e:
            return None

    def transcribe_audio(self):
        """
        Transcribe audio files in the given paths using the speech_recognition package and return the transcribed text as an array.
        """
        result = []
        with ThreadPoolExecutor() as executor:
            for audio_path in [self.audio_youtube, self.audio_podcast]:
                for filename in os.listdir(audio_path):
                    for medialink in os.listdir(os.path.join(audio_path, filename)):
                        futures = []
                        for audiofile in os.listdir(os.path.join(os.path.join(audio_path, filename),medialink)):
                            future = executor.submit(self.transcribe_audio_file, audio_path, filename, medialink, audiofile)
                            futures.append(future)
                        medialink_text = ""
                        for future in futures:
                            text = future.result()
                            if text is not None:
                                medialink_text += text + " "
                        result.append(medialink_text.strip())
        return result

    def delete_audio_files(self):
        """
        Delete all audio files in the given paths.
        """
        for audio_path in [self.audio_youtube, self.audio_podcast]:
            for filename in os.listdir(audio_path):
                shutil.rmtree(os.path.join(audio_path, filename))