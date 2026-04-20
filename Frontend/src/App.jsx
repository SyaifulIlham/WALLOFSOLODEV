import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/user/Home';
import DetailFilm from './pages/user/DetailFilm';
import DashboardAdmin from './pages/admin/dashboardadmin';
import ListFilm from './pages/admin/GetFilm';
import AddFilm from './pages/admin/Addfilm';
import EditFilm from './pages/admin/EditFilm';
import ListSchedule from './pages/admin/ListSchedule';
import AddSchedule from './pages/admin/AddSchedule';
import EditSchedule from './pages/admin/EditSchedule';
import Register from './pages/user/Register';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE UNTUK HALAMAN USER */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<DetailFilm />} />
        <Route path="/register" element={<Register />} />

        {/* RUTE UNTUK HALAMAN ADMIN */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/add" element={<AddFilm />} />
        <Route path="/admin/Getfilms" element={<ListFilm />} />
        <Route path="/admin/edit/:id" element={<EditFilm />} />
        <Route path="/admin/schedules" element={<ListSchedule />} />
        <Route path="/admin/schedules/add" element={<AddSchedule />} />
        <Route path="/admin/schedules/edit/:id" element={<EditSchedule />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;