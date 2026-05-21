import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';
import Home from './pages/user/Home';
import Movies from './pages/user/Movies'; 
import DetailFilm from './pages/user/DetailFilm';
import DashboardAdmin from './pages/admin/dashboardadmin';
import ListFilm from './pages/admin/GetFilm';
import AddFilm from './pages/admin/Addfilm';
import EditFilm from './pages/admin/EditFilm';
import ListSchedule from './pages/admin/ListSchedule';
import AddSchedule from './pages/admin/AddSchedule';
import EditSchedule from './pages/admin/EditSchedule';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import ManageSeats from './pages/admin/ManageSeats';
import SeatPicker from './pages/user/SeatPicker';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE UNTUK HALAMAN USER */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} /> {/* <--- INI DITAMBAHIN */}
        <Route path="/movie/:id" element={<DetailFilm />} />
        <Route path="/register" element={<Register />} />

        {/* TAMBAHKAN BARIS INI */}
        <Route path="/login" element={<Login />} />
        <Route path="/pesan/:id" element={<SeatPicker />} />

        {/* RUTE UNTUK HALAMAN ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute>
              <AddFilm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/Getfilms"
          element={
            <ProtectedRoute>
              <ListFilm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <EditFilm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedules"
          element={
            <ProtectedRoute>
              <ListSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedules/add"
          element={
            <ProtectedRoute>
              <AddSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedules/edit/:id"
          element={
            <ProtectedRoute>
              <EditSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seats"
          element={
            <ProtectedRoute>
              <ManageSeats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;