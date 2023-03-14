from transformers import BertTokenizer, AutoModelForSeq2SeqLM, pipeline
from arabert.preprocess import ArabertPreprocessor

model_name="malmarjeh/mbert2mbert-arabic-text-summarization"
preprocessor = ArabertPreprocessor(model_name="")

class Summarization:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.summarizer = pipeline("summarization", model=self.model, tokenizer=self.tokenizer)

    def summarize(self, text):
        text = preprocessor.preprocess(text)
        summary = pipeline(text,
            pad_token_id=self.tokenizer.eos_token_id,
            num_beams=3,
            repetition_penalty=3.0,
            max_length=200,
            length_penalty=1.0,
            no_repeat_ngram_size = 3)[0]['generated_text']
        return summary
    
    def summarize_list(self, text_list):
        summaries = []
        for text in text_list:
            summaries.append(self.summarize(text))
        return summaries