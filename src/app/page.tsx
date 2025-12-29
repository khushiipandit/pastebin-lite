'use client';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('0'); // 0 means no expiry
  const [maxViews, setMaxViews] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUrl('');

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          ttl_seconds: ttl === '0' ? null : parseInt(ttl),
          max_views: maxViews === '' ? null : parseInt(maxViews)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      if (data.url) setUrl(data.url);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Pastebin Lite</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea 
            className="w-full h-48 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your secret message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Expiration</label>
              <select 
                value={ttl} 
                onChange={(e) => setTtl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white"
              >
                <option value="0">Never</option>
                <option value="60">1 Minute</option>
                <option value="3600">1 Hour</option>
                <option value="86400">1 Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Max Views (Optional)</label>
              <input 
                type="number" 
                placeholder="Unlimited"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">
            {loading ? 'Creating...' : 'Create Secret Paste'}
          </button>
        </form>

        {url && (
          <div className="mt-8 p-6 bg-gray-800 border border-green-500 rounded-lg">
            <p className="text-green-400 font-bold mb-2">Success!</p>
            <div className="bg-black p-3 rounded font-mono text-blue-400 break-all border border-gray-700">
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
