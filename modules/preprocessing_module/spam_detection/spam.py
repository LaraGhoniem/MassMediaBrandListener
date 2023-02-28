import pickle
from modules.preprocessing_module.Preprocess import Preprocess
class Spam:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        with open('modules/preprocessing_module/spam_detection/tweet_spam_filter_arabic.pkl', 'rb') as f:
            self.model = pickle.load(f)
        with open('modules/preprocessing_module/spam_detection/tweet_spam_vectorizer_arabic.pkl', 'rb') as f:
            self.vectorizer = pickle.load(f)
    def predict(self, text):
        preprocess = Preprocess([text])
        preprocess.SpamPreProcess()
        preprocessedData = preprocess.data
        # print(preprocessedData)
        tfidf = self.vectorizer.transform([preprocessedData])
        result = self.model.predict(tfidf)
        return result



