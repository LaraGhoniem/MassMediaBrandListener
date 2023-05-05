from transformers import BertTokenizer, AutoModelForSeq2SeqLM, pipeline
from arabert.preprocess import ArabertPreprocessor
import re
import string
from rouge import Rouge
from typing import List
import pyarabic.araby as araby

model_name="malmarjeh/mbert2mbert-arabic-text-summarization"
preprocessor = ArabertPreprocessor(model_name="bert-base-arabertv02")

class Summarization:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.summarizer = pipeline("summarization", model=self.model, tokenizer=self.tokenizer)

    def split_text(self, text, max_len, tokenizer):
        tokens = tokenizer.tokenize(text)
        token_chunks = [tokens[i:i+max_len] for i in range(0, len(tokens), max_len)]
        text_chunks = [tokenizer.convert_tokens_to_string(chunk) for chunk in token_chunks]
        return text_chunks
    
    def remove_english_characters(self, text):
        # Define a regular expression pattern to match English characters
        pattern = r'[a-zA-Z]'
        
        # Use the re.sub() function to remove all English characters from the text
        cleaned_text = re.sub(pattern, '', text)
        
        return cleaned_text
    
    def remove_punctuation(self, text):
        # Define a translation table to remove punctuation marks
        translator = str.maketrans('', '', string.punctuation)
        
        # Use the translate() method to remove punctuation marks from the text
        cleaned_text = text.translate(translator)
        
        return cleaned_text
    
    def remove_non_arabic_characters(self, text):
        # Define a regular expression pattern to match non-Arabic characters
        pattern = r'[^\u0621-\u064A0-9]'
        
        # Use the re.sub() function to remove all non-Arabic characters from the text
        cleaned_text = re.sub(pattern, '', text)
        
        return cleaned_text

    def remove_html_tags(self,text):
        # Define a regular expression pattern to match HTML tags
        pattern = r'<[^>]*>'
        
        # Use the re.sub() function to remove all HTML tags from the text
        cleaned_text = re.sub(pattern, '', text)
        
        return cleaned_text
    
    def preprocess_arabic(self, text: str) -> str:
        text = araby.strip_tashkeel(text) # remove diacritics
        text = araby.normalize_hamza(text) # normalize hamza
        words = araby.tokenize(text) # tokenize into words
        return ' '.join(words)

    def pick_best_summary(self, system_summaries: List[str], reference_summary: str) -> str:
        rouge = Rouge()
        best_summary = None
        best_f1 = 0
        reference_summary = self.preprocess_arabic(reference_summary)
        for summary in system_summaries:
            raw_summary = summary
            summary = self.preprocess_arabic(summary)
            scores = rouge.get_scores(summary, reference_summary)
            f1 = scores[0]['rouge-1']['f']
            if f1 > best_f1:
                best_f1 = f1
                best_summary = raw_summary
        return best_summary


    def summarize(self, text):
        # remove punctuation and HTML tags from the text
        text = self.remove_punctuation(text)
        text = self.remove_html_tags(text)
        text = self.remove_english_characters(text)
        text = self.remove_non_arabic_characters(text)

        if(len(text) == 0):
            return "The summarization model is currently supporting the arabic language only."

        # split the text into chunks of 200 tokens
        splitted_text = self.split_text(text, 200, self.tokenizer)

        results = []
        for split_text in splitted_text:
            # preprocess the text
            split_text = preprocessor.preprocess(split_text)

            # generate a summary using the summarizer
            if(len(split_text.split()) > 5):
                result = self.summarizer(
                    split_text,
                    pad_token_id=self.tokenizer.eos_token_id,
                    num_beams=3,
                    repetition_penalty=3.0,
                    max_length= len(split_text.split()),
                    length_penalty=1.0,
                    no_repeat_ngram_size=3
                )[0]['summary_text']
            else:
                result = "Summary"

            results.append(result)

        # pick the best summary out of the generated summaries
        most_similar_doc = self.pick_best_summary(results, text)

        return most_similar_doc

    def summarize_list(self, text_list):
        '''Summarize a list of texts'''
        summaries = []
        for text in text_list:
            # generate a summary for each text in the list
            summaries.append(self.summarize(text))
        return summaries
    