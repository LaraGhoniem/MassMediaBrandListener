import nltk
import re
import pyarabic.araby as araby
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

class Preprocess:
    def __init__(self,data = []):
        self.data = data
        self.stop_words = stopwords.words('arabic')
    def tokenize(self,English:bool):
        if(English):
            return [araby.tokenize(text, conditions = araby.is_arabicrange, morphs=araby.strip_tashkeel) for text in self.data]
        else:
            return [araby.tokenize(text) for text in self.data]
    def removeRepetition(self):
        return [araby.strip_tatweel(text) for text in self.data]
    def remove_emojis(self):
        return [word for word in self.data if not re.search(r'[^\w\s,]', word)]
    def removeStopWords(self,tweet):
        tokens = word_tokenize(tweet)
        filtered_tokens = [token for token in tokens if token not in self.stop_words]
        # arb_stop_words = set(nltk.corpus.stopwords.words("arabic"))
        preprocessed_tweet = ' '.join(filtered_tokens)
        return preprocessed_tweet
    def stem(self):
        st = nltk.ISRIStemmer()
        return ''.join([[st.stem(token) for token in x] for x in self.data])
    def remove_special_characters(text):
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text
    def SpamPreProcess(self):
        self.data = [self.removeStopWords(tweet) for tweet in self.data]
        self.data = ''.join(self.data)
    def removeEnglishWords(self):
        return [re.sub(r'[a-zA-Z]+', '', text) for text in self.data]
    def ArticlePreProcess(self,text):
        text = re.sub(r'@\w+', '',text)
        text = re.sub(r'https?://\S+', '', text)
        text = re.sub(r'https?://\S+', '', text)
        text = ''.join([araby.tokenize(text, conditions = araby.is_arabicrange, morphs=araby.strip_tashkeel)])
        return text

