from classes.api_calls import ApiCall

class ObserverListener:
    def __init__(self, id, name, keywords, categories, user):
        self.id = id
        self.name = name
        self.keywords = keywords
        self.categories = categories
        self.user = user
        self.user.addListener(self)
    def listen(self, youtube_result):
        result = []
        for keyword in self.keywords:
            apiCall = ApiCall(keyword, self.categories,self.id)
            apiCall.send(youtube_result)
            result.append(apiCall.result)
        self.result = result
        
    
    def notify(self,result):
        # do something
        pass
