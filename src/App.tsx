import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoList from './components/VideoList';
import DetailPage from './components/DetailPage';
// import VideoListDjango from './components/VideoListDjango';
// import DetailPageDjango from './components/DetailPageDjango';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/video/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
