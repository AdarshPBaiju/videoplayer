import { Link } from 'react-router-dom';
import videos from '../data/videos';

const VideoList = () => {
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

export default VideoList;
