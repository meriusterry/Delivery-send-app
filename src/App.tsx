import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewRequest from './pages/NewRequest';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import RequestDetail from './pages/RequestDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="new" element={<NewRequest />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="profile" element={<Profile />} />
          <Route path="request/:id" element={<RequestDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;