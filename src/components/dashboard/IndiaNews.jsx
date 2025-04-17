// components/IndiaNews.jsx
"use client";
import { useEffect, useState } from "react";

const IndiaNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/indian-news"); // Update if deployed
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Indian Business News</h2>
      <ul className="space-y-4">
        {news.map((item, index) => (
          <li key={index} className="border p-4 rounded shadow">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-600">{item.published}</p>
            <div
              className="text-gray-700 text-sm mt-2"
              dangerouslySetInnerHTML={{ __html: item.summary }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndiaNews;
