import React from 'react';
import { Link } from 'react-router-dom'; // Tambahkan ini untuk Link ke Admin
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavScroll() {
  return (
    // 1. Ganti bg-primary jadi background hitam pekat ala SoloFlixx
    <Navbar expand="lg" variant="dark" sticky="top" style={{ backgroundColor: '#0a0b0d', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '100%', backdropFilter: 'blur(10px)' }}>
      <Container fluid className="py-1 px-lg-4">
        
        {/* 2. Logo SoloFlixx Merah Putih */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3" style={{ letterSpacing: '1px' }}>
            <span style={{ color: '#dc3545' }}>Solo</span><span className="text-white">Flixx</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 gap-lg-3" navbarScroll>
            
            {/* 3. Link Menu dengan efek hover kustom */}
            <Nav.Link href="/#sedang-tayang" className="text-light nav-custom-hover">Sedang Tayang</Nav.Link>
            <Nav.Link href="/#akan-datang" className="text-light nav-custom-hover">Akan Datang</Nav.Link>
            
            <NavDropdown menuVariant="dark" title={<span className="text-light nav-custom-hover">Kota</span>} id="navbarScrollingDropdown">
              <NavDropdown.Item href="#jakarta" className="drop-hover">Jakarta</NavDropdown.Item>
              <NavDropdown.Item href="#bandung" className="drop-hover">Bandung</NavDropdown.Item>
              <NavDropdown.Item href="#surabaya" className="drop-hover">Surabaya</NavDropdown.Item>
              <NavDropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <NavDropdown.Item href="#all-cities" className="drop-hover text-info">Lihat Semua Kota</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#promo" className="text-light nav-custom-hover">Promo</Nav.Link>
          </Nav>

          {/* 4. Search Bar & Tombol Login */}
          <Form className="d-flex align-items-center mt-3 mt-lg-0 gap-3">
            <Form.Control
              type="search"
              placeholder="Cari film atau bioskop..."
              className="search-custom bg-dark text-white border-secondary shadow-none"
              aria-label="Search"
            />
            {/* Tombol Login diarahkan ke /admin */}
            <Button as={Link} to="/admin" variant="danger" className="px-4 fw-bold rounded-pill btn-login shadow-sm">
              Login
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>

      {/* 5. CSS Custom untuk Hover & Input */}
      <style>
        {`
            /* Efek menu saat disorot */
            .nav-custom-hover { transition: all 0.3s ease; font-weight: 500; font-size: 0.95rem; opacity: 0.8; }
            .nav-custom-hover:hover { color: #dc3545 !important; opacity: 1; transform: translateY(-2px); }
            
            /* Efek Dropdown Kota */
            .drop-hover { color: #c9d1d9 !important; transition: 0.2s; }
            .drop-hover:hover { background-color: #dc3545 !important; color: white !important; }
            
            /* Efek Search Bar */
            .search-custom:focus { 
                background-color: #161b22 !important; 
                border-color: #dc3545 !important; 
                color: white !important; 
                box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important; 
            }
            .search-custom::placeholder { color: #8b949e; }
            
            /* Efek Tombol Login */
            .btn-login { transition: all 0.3s ease; }
            .btn-login:hover { background-color: #b02a37; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(220,53,69,0.4) !important; }
            
            html { scroll-behavior: smooth; }
        `}
      </style>
    </Navbar>
  );
}

export default NavScroll;