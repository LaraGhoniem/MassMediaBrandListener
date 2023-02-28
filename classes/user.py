class User:
    """A class for user profiles"""
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email
        self.listeners = []
    def addListener(self, listener):
        self.listeners.append(listener)