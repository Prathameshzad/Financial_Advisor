"use client"
import { useState, useEffect } from 'react';

const FinancialNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/top-financial-news');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === 'success') {
          if (data.articles.length === 0 && retryCount < 2) {
            // If no articles but API call was successful, retry with delay
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
            return;
          }
          setNews(data.articles);
        } else {
          throw new Error(data.message || 'Error fetching news');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [retryCount]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="text-gray-600">
        {retryCount > 0 ? 'Refining news search...' : 'Loading financial news...'}
      </span>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
      <p className="font-bold">Error loading news</p>
      <p>{error}</p>
      <button 
        onClick={() => {
          setLoading(true);
          setError(null);
          setRetryCount(0);
        }}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>
  );

  if (news.length === 0 && !loading) return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded">
      <p className="font-bold">No news articles found</p>
      <p>We couldn't fetch any financial news at the moment. Please try again later.</p>
      <button 
        onClick={() => {
          setLoading(true);
          setRetryCount(0);
        }}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Latest Financial News
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100"
          >
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/news-placeholder.jpg';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {article.title}
                </a>
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.description || 'No description available'}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="font-medium">{article.source || 'Unknown source'}</span>
                <span>
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Date not available'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialNews;