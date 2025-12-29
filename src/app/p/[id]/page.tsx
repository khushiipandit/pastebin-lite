'use client';
import { useEffect, useState, use } from 'react';

export default function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await fetch(`/api/pastes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'This paste is no longer available.');
        } else {
          setContent(data.content);
        }
      } catch (err) {
        setError('Failed to load paste.');
      } finally {
        setLoading(false);
      }
    }
    fetchPaste();
  }, [id]);

  if (loading) return <div className="p-8 text-white bg-gray-900 min-h-screen">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">View Paste</h1>
        {error ? (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        ) : (
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg whitespace-pre-wrap font-mono">
            {content}
          </div>
        )}
        <div className="mt-6">
          <a href="/" className="text-blue-400 hover:underline">← Create New Paste</a>
        </div>
      </div>
    </main>
  );
}
