import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const VideoListDjango = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/video/'); // Update with your actual API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) {
    return <div className="text-white">Loading videos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl mb-4">Video List</h1>
      <ul>
        {videos.map(video => (
          <li key={video.id} className="mb-2">
            <Link to={`/video/${video.id}`} className="text-blue-400 hover:underline">
              {video.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoListDjango;
