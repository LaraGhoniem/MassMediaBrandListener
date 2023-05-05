from classes.api_calls import ApiCall



class Engine:
    def __init__(self, listeners=[]):
        """Initialize the engine with a list of listeners."""
        self.listeners = listeners

    def get_unique_categories(self):
        """Get a list of unique categories from all listeners."""
        unique_categories = {}
        for listener in self.listeners:
            for category in listener.categories:
                unique_categories[category["_id"]] = None
        return list(unique_categories.keys())

    def get_youtube_result(self, categories):
        """Get the YouTube result for the given categories."""
        youtube_result = []
        for category in categories:
            media_links = ApiCall.get_media_links_by_category_id(category)
            media_links = [media_link["media_link"] for media_link in media_links if media_link["media_link_type"] == "youtube"]
            youtube_result.append({
                "category_id": category,
                "text": ApiCall.get_youtube_podcast_text(media_links)
            })
        
        return youtube_result

    def run(self):
        """Run the engine by calling the listen method of each listener."""
        unique_categories = self.get_unique_categories()
        youtube_result = self.get_youtube_result(unique_categories)
        print("The results given by the youtube module: " + str(youtube_result))
        for listener in self.listeners:
            listener.listen(youtube_result)

    def result_json(self):
        """Get the result of each listener as a JSON object."""
        result = {}
        for listener in self.listeners:
            result[listener.id] = listener.result
        return result

    def addListener(self, listener):
        """Add a new listener to the engine."""
        self.listeners.append(listener)