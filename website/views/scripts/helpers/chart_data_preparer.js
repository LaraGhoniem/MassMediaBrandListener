class ChartDataPreparer {
    constructor(listener_data) {
        this.listener_data = listener_data;
    }

    mentions_over_time_chart_data() {
        // Set the date to one year ago
        let oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Filter the data to only include entries from the past year
        let filteredData = this.listener_data.filter(obj => new Date(obj["created_at"]) >= oneYearAgo);

        // Count the number of mentions for each date
        let counts = filteredData.reduce((acc, obj) => {
            let key = obj["created_at"].split("T")[0]
            if (!acc[key])
                acc[key] = 0
            acc[key]++
            return acc
        }, {});

        // Format the dates for the chart labels
        let mentionsChartLabels = Object.keys(counts).map(date => {
            let date_split = date.split("-")
            return date_split[2]+"/"+date_split[1]
        });

        // Get the data for the chart
        let mentionsChartData = Object.values(counts);

        return [mentionsChartLabels, mentionsChartData];
    }

    pos_mentions_over_time_chart_data() {
        // Set the date to one year ago
        let oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Filter the data to only include entries from the past year
        let filteredData = this.listener_data.filter(obj => new Date(obj["created_at"]) >= oneYearAgo);

        // Count the number of positive mentions for each date
        let counts = filteredData.reduce((acc, obj) => {
            let key = obj["created_at"].split("T")[0]
            if (!acc[key]) 
                acc[key] = 0
            if(obj["sentiment"] === "positive")
                acc[key]++
            return acc
        }, {});

        // Format the dates for the chart labels
        let pos_mentions_labels = Object.keys(counts).map(date => {
            let date_split = date.split("-")
            return date_split[2]+"/"+date_split[1]
        });

        // Get the data for the chart
        let pos_mentions_data = Object.values(counts);
        return [pos_mentions_labels, pos_mentions_data];
    }

    sentiment_source_chart_data() {
        // Define the sources and sentiments to include in the chart
        let sources = ['youtube', 'podcast', 'twitter', 'news'];
        let sentiments = ['positive', 'negative', 'neutral'];

        // Initialize the result object
        let result = {};

        // Count the number of mentions for each source and sentiment
        sources.forEach(source => {
            result[source] = {};
            sentiments.forEach(sentiment => {
                result[source][sentiment] = this.listener_data.filter(obj => obj['source'] === source && obj['sentiment'] === sentiment).length;
            });
        });

        return result;
    }

    top_keywords_chart_data() {
        // Count the number of mentions for each keyword
        let counts = this.listener_data.reduce((acc, obj) => {
            let key = obj['keyword'];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});

        return counts;
    }

    sentiment_share_chart_data() {
        // Count the number of positive, negative, and neutral mentions
        let positiveCount = this.listener_data.filter(obj => obj['sentiment'] === 'positive').length;
        let negativeCount = this.listener_data.filter(obj => obj['sentiment'] === 'negative').length;
        let neutralCount = this.listener_data.filter(obj => obj['sentiment'] === 'neutral').length;

        return [positiveCount, negativeCount, neutralCount];
    }

    sources_chart_data() {
        // Count the number of mentions for each source
        let youtubeCount = this.listener_data.filter(obj => obj['source'] === 'youtube').length;
        let podcastCount = this.listener_data.filter(obj => obj['source'] === 'podcast').length;
        let twitterCount = this.listener_data.filter(obj => obj['source'] === 'twitter').length;
        let newsCount = this.listener_data.filter(obj => obj['source'] === 'news').length;

        return [youtubeCount, podcastCount, twitterCount, newsCount];
    }
}

export default ChartDataPreparer;