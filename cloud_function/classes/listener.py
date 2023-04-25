from classes.user import User
from classes.api_calls import ApiCall
import json

class ObserverListener:
    def __init__(self, id, name, keywords, category, user):
        self.id = id
        self.name = name
        self.keywords = keywords
        self.category = category
        self.status = "inactive"
        self.user = user
        self.user.addListener(self)
        self.result = []
    def listen(self):
        result = []
        for keyword in self.keywords:
            apiCall = ApiCall(keyword, self.category,self.id)
            apiCall.send()
            result.append(apiCall.result)
        self.result = result
        
    
    def notify(self,result):
        # do something
        pass

    def toDict(self):
        return {
            "listener_name": self.name,
            "category_id": self.category,
            "listener_status": "active",
            "result": json.dumps(self.result)
        }
