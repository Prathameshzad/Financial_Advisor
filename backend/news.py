from flask import Blueprint, jsonify
import requests
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()

news_blueprint = Blueprint('news', __name__)

NEWS_API_URL = "https://newsapi.org/v2/everything"  # Changed from top-headlines to everything
API_KEY = os.getenv("NEWS_API_KEY")

@news_blueprint.route('/top-financial-news', methods=['GET'])
def get_top_financial_news():
    # Calculate date from 1 week ago for more results
    one_week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    params = {
        'q': '(finance OR stock OR market OR economy OR investing OR stocks OR trading)',
        'language': 'en',
        'sortBy': 'publishedAt',
        'pageSize': 10,
        'apiKey': API_KEY,
        'from': one_week_ago,
        'domains': 'bloomberg.com,cnbc.com,reuters.com,marketwatch.com,wsj.com,investing.com',
        # You can also try removing the domains parameter for broader results
    }
    
    try:
        response = requests.get(NEWS_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        articles = data.get('articles', [])
        
        # If no articles, try a more generic query
        if not articles:
            params['q'] = 'stock market'
            fallback_response = requests.get(NEWS_API_URL, params=params)
            fallback_response.raise_for_status()
            data = fallback_response.json()
            articles = data.get('articles', [])
        
        formatted_articles = []
        for article in articles:
            formatted_articles.append({
                'title': article.get('title', ''),
                'description': article.get('description', ''),
                'url': article.get('url', ''),
                'source': article.get('source', {}).get('name', ''),
                'publishedAt': article.get('publishedAt', ''),
                'imageUrl': article.get('urlToImage', '')
            })
        
        return jsonify({
            'status': 'success',
            'articles': formatted_articles,
            'totalResults': data.get('totalResults', 0)
        })
    
    except requests.exceptions.RequestException as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'articles': []
        }), 500