import { useParams, Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import videos from '../data/videos';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const video = videos.find(video => video.id === id);

  if (!video) {
    return <div className="text-white text-center mt-10">Video not found</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen flex flex-col items-center">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
          {video.title}
        </h1>
        <p className="text-gray-400 font-light text-base sm:text-lg">
          Enjoy watching this amazing video!
        </p>
      </div>
      <div className="relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden transform transition duration-300">
        <VideoPlayer
          url={video.url} 
          subtitleUrl={video.subtitleUrl}
          thumbnail={video.thumbnail}
        />
      </div>
      <div className="mt-8 text-gray-300 text-center px-4 max-w-xl">
        <p className="leading-relaxed text-base sm:text-lg">
          Dive into the immersive experience provided by this video, with customizable options and high-quality subtitles for better understanding.
        </p>
      </div>
      <Link to="/" className="mt-8 inline-block text-blue-400 hover:text-blue-300 transition duration-200">
        ← Back to Home
      </Link>
    </div>
  );
};

export default DetailPage;
