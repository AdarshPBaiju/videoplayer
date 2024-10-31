import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer/VideoPlayer';

const DetailPageDjango = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState(null);
  const [subtitle, setSubtitle] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/videodetail/${id}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVideo(data.video);
        setSubtitle(data.subtitle);
        setThumbnail(data.thumbnail);
        setTitle(data.title);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center mt-10 animate-pulse">Loading video details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!video) {
    return <div className="text-white text-center mt-10">Video not found</div>;
  }

  return (
    <div className="p-0 sm:p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen flex flex-col items-center">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-extrabold mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-gray-400 font-light text-lg">Explore this video content with rich details and high-quality streaming.</p>
      </div>
      <div className="relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden transform transition duration-300">
        <VideoPlayer 
          url={video}
          subtitleUrl={subtitle}
          thumbnail={thumbnail}
        />
      </div>
      <div className="mt-10 text-gray-300 text-center px-4 max-w-xl">
        <p className="leading-relaxed text-lg">
          Dive into the immersive experience provided by this video, with customizable options and high-quality subtitles for better understanding.
        </p>
      </div>
      <Link to="/" className="mt-8 inline-block text-blue-400 hover:text-blue-300 transition duration-200">
        ← Back to Home
      </Link>
    </div>
  );
};

export default DetailPageDjango;
