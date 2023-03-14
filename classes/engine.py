
class Engine:
    def __init__(self, listeners = []):
        self.listeners = listeners
    def run(self):
        for listener in self.listeners:
                listener.listen()
        
    def result_json(self):
        result = {}
        for listener in self.listeners:
            result[listener.id] = listener.result
        return result
    def addListener(self, listener):
        self.listeners.append(listener)