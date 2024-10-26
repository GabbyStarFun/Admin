"use client";
import React, { useState, useEffect } from 'react';

function ApiDocumentationPage() {
  const [statsData, setStatsData] = useState(null);
  const [apiUrl, setApiUrl] = useState('/api/stats');

  const fetchApiData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching stats data:', error);
    }
  };

  useEffect(() => {
    fetchApiData();
    const intervalId = setInterval(() => fetchApiData(), 3000);
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  return (
    <div className="h-screen bg-lime-900 text-white">  {/* Set height to screen */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-4">API Documentation</h1>
        <div className="flex justify-between items-center mb-4">
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2 text-lime-500">Base URL</h2>
          <p className="text-gray-300">https://www.limeradio.net/api</p>
          <h2 className="text-2xl font-semibold mb-2 text-lime-500">Endpoints</h2>
          <ul className="list-disc pl-6 text-white">
            <li className="mb-2 flex items-center">
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500 text-white">
                <p className="font-medium">GET</p>
              </div>
              <h3 className="text-lg font-medium text-lime-300 ml-4">Now Playing Metadata</h3>
              <pre className="bg-gray-700 p-2 rounded-lg text-white ml-4">
                {statsData && JSON.stringify(statsData, null, 2)}
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ApiDocumentationPage;