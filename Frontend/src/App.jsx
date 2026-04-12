import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/user/Home';
import DetailFilm from './pages/user/DetailFilm';
import ListFilm from './pages/admin/ListFilm';
import AddFilm from './pages/admin/Addfilm';
import EditFilm from './pages/admin/EditFilm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE UNTUK HALAMAN USER */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<DetailFilm />} />

        {/* RUTE UNTUK HALAMAN ADMIN */}
        <Route path="/admin" element={<ListFilm />} />
        <Route path="/admin/add" element={<AddFilm />} />
        <Route path="/admin/edit/:id" element={<EditFilm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;