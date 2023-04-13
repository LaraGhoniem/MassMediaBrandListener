const table_header = 
`<tr>
    <th scope = "col"><i class='bx bx-list-ul icon'></i>Date</th>
    <th scope="col">
        <i class='bx bx-list-ul icon'></i>
        Mention</th>
    <th scope="col">
        <i class='bx bx-list-ul icon'></i>
        Source</th>
    <th scope="col">
        <i class='bx bx-list-ul icon'></i>Sentiment</th>
    <th scope="col">
        <i class='bx bx-list-ul icon'></i>Summary</th>
    <th scope="col">
        <i class='bx bx-list-ul icon'></i>URL</th>
</tr>`
class Mentions{
    
    constructor(listener){
        this.currentPage = 0;
        this.source_parts = 0;
        this.pagination_div = document.getElementById("pagination_div");
        this.listener = listener;
        this.pages = 0;
        this.initializePagination();
    }

    initializePagination(){
        this.pagination_div.innerHTML = "";
        const all_listener_length = this.listener.length;
        for (let i = 0; i < all_listener_length; i++) {
            const listener_length = this.listener[i].length;
            for (let j = 0; j < listener_length; j++) {
                const keyword = Object.keys(this.listener[i][j])[0];
                this.pages += this.listener[i][j][keyword]["twitter"]["text"]["preprocessed_text"].length;
                this.pages += this.listener[i][j][keyword]["news"]["text"].length;
                this.source_parts++;
            }
        }
        this.pages = Math.ceil(this.pages / 50);
        this.pagination_back_button();
        let pagination_numbers = document.createElement("div");
        pagination_numbers.classList.add("pagination-numbers");
        for (let i = 0; i < this.pages; i++) {
        let page = document.createElement("div");
        page.classList.add("page");
        page.innerHTML = i + 1;
        page.addEventListener("click", () => {
            let pages = document.getElementsByClassName("page");
            for (let j = 0; j < pages.length; j++) {
            pages[j].classList.remove("active");
            }
            page.classList.add("active");
            this.currentPage = i;
            this.viewMentions(this.listener);
        });
        pagination_numbers.appendChild(page);
        }
        this.pagination_div.appendChild(pagination_numbers);
        this.pagination_next_button();
    }

    pagination_back_button(){
        let previous = document.createElement("div");
        previous.classList.add("button-pagination");
        previous.innerHTML = "<i class='bx bx-chevron-left' ></i> Previous";
        previous.addEventListener("click", () => {
        let pages = document.getElementsByClassName("page");
        if (this.currentPage > 0) {
            for (let j = 0; j < pages.length; j++) {
            pages[j].classList.remove("active");
            }
            this.currentPage--;
            pages[this.currentPage].classList.add("active");
            this.viewMentions(this.listener);
        }
        });
        this.pagination_div.appendChild(previous);
    }

    pagination_next_button(){
        let next = document.createElement("div");
        next.classList.add("button-pagination");
        next.innerHTML = "Next <i class='bx bx-chevron-right' ></i>";
        next.addEventListener("click", () => {
        let pages = document.getElementsByClassName("page");
        if (this.currentPage < pages.length - 1) {
            for (let j = 0; j < pages.length; j++) {
            pages[j].classList.remove("active");
            }
            this.currentPage++;
            pages[this.currentPage].classList.add("active");
            this.viewMentions(this.listener);
        }
        });
        this.pagination_div.appendChild(next);

        // set first page active
        let pages_by_class = document.getElementsByClassName("page");
        pages_by_class[0].classList.add("active");
    }

    viewMentions(listener){
        let mentions_table = document.getElementById("mentions-table")
        var innerHTML = table_header
        let listeners_length = listener.length;
        for(let i = 0; i < listeners_length; i++){
            let listener_length = listener[i].length;
            for(let j = 0; j < listener_length; j++){
                const keyword = Object.keys(listener[i][j])[0]
                //calculate the start and end indices for the current page
                const start_index = (this.currentPage)* Math.floor(50/this.source_parts)
                const end_index = start_index + Math.floor(50/this.source_parts)
                //TWITTER
                const twitter_text = listener[i][j][keyword]["twitter"]["text"]["preprocessed_text"]
                const twitter_links_dates = listener[i][j][keyword]["twitter"]["links_dates"].slice(start_index,end_index)
                const twitter_sentiment = listener[i][j][keyword]["twitter"]["sentiment"].slice(start_index,end_index)
                const twitter_spam_tweets = listener[i][j][keyword]["twitter"]["spam"].slice(start_index,end_index)
                //NEWS
                const news_text = listener[i][j][keyword]["news"]["text"]
                const news_links = listener[i][j][keyword]["news"]["links"].slice(start_index,end_index)
                const news_links_dates = listener[i][j][keyword]["news"]["publishedAt"].slice(start_index,end_index)
                const news_sentiment = listener[i][j][keyword]["news"]["sentiment"].slice(start_index,end_index)
                //TWITTER
                const tweet_row = twitter_text.slice(start_index,end_index).map((tweet, k) => {
                    tweet = preprocess_text(tweet)
                    tweet = truncateText(tweet,twitter_sentiment[k],twitter_links_dates[k]["link"],twitter_links_dates[k]["date"],keyword,"twitter")
                    let tweet_published_at = format_date(twitter_links_dates[k]["date"])
                    return generateTweetRow(tweet,tweet_published_at,twitter_sentiment[k],twitter_links_dates[k]["link"],twitter_spam_tweets[k])
                })
                innerHTML += tweet_row.join("")

                //NEWS
                const news_rows = news_text.slice(start_index,end_index).map((news, k) => {
                    news = preprocess_text(news)
                    news = truncateText(news,news_sentiment[k],news_links[k],news_links_dates[k],keyword,"news")
                    let news_published_at = format_date(news_links_dates[k])
                    return generateNewsRow(news,news_published_at,news_sentiment[k],news_links[k])
                })
                innerHTML += news_rows.join("")
            }
        }
        document.getElementById("table-container").style.display = "block"
        document.getElementById("loading-container").style.display = "none"
        mentions_table.innerHTML += innerHTML
    }
}

export default Mentions