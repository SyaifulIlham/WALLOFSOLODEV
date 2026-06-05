import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const Home = lazy(() => import('./pages/user/Home'));
const Movies = lazy(() => import('./pages/user/Movies'));
const DetailFilm = lazy(() => import('./pages/user/DetailFilm'));
const DashboardAdmin = lazy(() => import('./pages/admin/dashboardadmin'));
const ListFilm = lazy(() => import('./pages/admin/GetFilm'));
const AddFilm = lazy(() => import('./pages/admin/Addfilm'));
const EditFilm = lazy(() => import('./pages/admin/EditFilm'));
const ListSchedule = lazy(() => import('./pages/admin/ListSchedule'));
const AddSchedule = lazy(() => import('./pages/admin/AddSchedule'));
const EditSchedule = lazy(() => import('./pages/admin/EditSchedule'));
const Register = lazy(() => import('./pages/user/Register'));
const Login = lazy(() => import('./pages/user/Login'));
const ManageSeats = lazy(() => import('./pages/admin/ManageSeats'));
const SeatPicker = lazy(() => import('./pages/user/SeatPicker'));
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import Checkout from './pages/user/Checkout';
import ETicket  from './pages/user/ETicket';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE UNTUK HALAMAN USER */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} /> {/* <--- INI DITAMBAHIN */}
        <Route path="/movie/:id" element={<DetailFilm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/eticket"  element={<ETicket />} />    

        {/* TAMBAHKAN BARIS INI */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/pesan/:id"
          element={
            <UserProtectedRoute>
              <SeatPicker />
            </UserProtectedRoute>
          }
        />
      <Suspense fallback={<div className="page-loading">Loading...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;