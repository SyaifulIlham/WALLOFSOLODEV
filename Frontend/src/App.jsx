import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/custom.css';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';

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
const Checkout = lazy(() => import('./pages/user/Checkout'));
const ETicket = lazy(() => import('./pages/user/ETicket'));



function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loading">Loading...</div>}>
        <Routes>
          {/* RUTE UNTUK HALAMAN USER */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<DetailFilm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/eticket" element={<ETicket />} />
          <Route
            path="/pesan/:id"
            element={
              <UserProtectedRoute>
                <SeatPicker />
              </UserProtectedRoute>
            }
          />

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