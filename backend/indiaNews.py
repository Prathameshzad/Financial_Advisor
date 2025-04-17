# indiaNews.py
import feedparser
from flask import Blueprint, jsonify

india_news_blueprint = Blueprint('india_news', __name__)

def fetch_indian_business_news():
    url = "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"
    feed = feedparser.parse(url)

    news_list = []
    for entry in feed.entries[:10]:  # Top 10 articles
        news_list.append({
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "summary": entry.summary
        })
    return news_list

@india_news_blueprint.route('/api/indian-news', methods=['GET'])
def get_indian_news():
    news_data = fetch_indian_business_news()
    return jsonify(news_data)
