import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';

function NavScroll() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['sedang-tayang', 'akan-datang', 'promo'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter films
      console.log('Searching for:', searchQuery);
      // You can implement search navigation here
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (section) => {
    return location.pathname === '/' && activeSection === section ? 'active' : '';
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      fixed="top"
      className={`navbar-transition ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 11, 13, 0.95)' : '#0a0b0d',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
    >
      <Container fluid className="py-2 px-lg-4">
        {/* Logo with animation */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 logo-animation" style={{ letterSpacing: '1px' }}>
          <span style={{ color: '#dc3545' }}>Solo</span><span className="text-white">Flixx</span>
        </Navbar.Brand>

        {/* Mobile menu toggle */}
        <div className="d-lg-none">
          <button
            className="mobile-menu-toggle border-0 bg-transparent text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <Navbar.Collapse id="navbarScroll" className={isMobileMenuOpen ? 'show' : ''}>
          <Nav className="me-auto my-2 my-lg-0 gap-lg-3" navbarScroll>

            {/* Navigation Links with active states */}
            <Nav.Link
              href="/#sedang-tayang"
              className={`text-light nav-custom-hover ${isActive('sedang-tayang')}`}
            >
              Sedang Tayang
            </Nav.Link>
            <Nav.Link
              href="/#akan-datang"
              className={`text-light nav-custom-hover ${isActive('akan-datang')}`}
            >
              Akan Datang
            </Nav.Link>

            <NavDropdown
              menuVariant="dark"
              title={<span className="text-light nav-custom-hover">Kota</span>}
              id="navbarScrollingDropdown"
              className="nav-dropdown-custom"
            >
              <NavDropdown.Item href="#jakarta" className="drop-hover city-item">
                <span className="city-icon">🏙️</span> Jakarta
              </NavDropdown.Item>
              <NavDropdown.Item href="#bandung" className="drop-hover city-item">
                <span className="city-icon">🏔️</span> Bandung
              </NavDropdown.Item>
              <NavDropdown.Item href="#surabaya" className="drop-hover city-item">
                <span className="city-icon">🌆</span> Surabaya
              </NavDropdown.Item>
              <NavDropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <NavDropdown.Item href="#all-cities" className="drop-hover text-info view-all">
                🌍 Lihat Semua Kota
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              href="#promo"
              className={`text-light nav-custom-hover ${isActive('promo')}`}
            >
              Promo
            </Nav.Link>
          </Nav>

          {/* Search Bar & Login Button */}
          <Form className="d-flex align-items-center mt-3 mt-lg-0 gap-3" onSubmit={handleSearch}>
            <div className="search-container">
              <Form.Control
                type="search"
                placeholder="Cari film atau bioskop..."
                className="search-custom bg-dark text-white border-secondary shadow-none"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </div>

            <Button as={Link} to="/register" variant="danger" className="px-4 fw-bold rounded-pill btn-login shadow-sm">
              <FaUser className="me-2" />
              Login
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>

      {/* Enhanced CSS */}
      <style>
        {`
          .navbar-transition {
            transition: all 0.3s ease;
          }

          .navbar-scrolled {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            box-shadow: 0 2px 20px rgba(0,0,0,0.3);
          }

          .logo-animation {
            transition: transform 0.3s ease;
          }

          .logo-animation:hover {
            transform: scale(1.05);
          }

          .mobile-menu-toggle {
            transition: transform 0.3s ease;
          }

          .mobile-menu-toggle:hover {
            transform: scale(1.1);
          }

          /* Navigation Links */
          .nav-custom-hover {
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 0.95rem;
            opacity: 0.8;
            position: relative;
          }

          .nav-custom-hover:hover,
          .nav-custom-hover.active {
            color: #dc3545 !important;
            opacity: 1;
            transform: translateY(-2px);
          }

          .nav-custom-hover.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 2px;
            background-color: #dc3545;
            border-radius: 1px;
          }

          /* Dropdown Enhancements */
          .nav-dropdown-custom .dropdown-menu {
            border: 1px solid rgba(255,255,255,0.1);
            background-color: rgba(10, 11, 13, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            margin-top: 8px;
          }

          .city-item {
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }

          .city-icon {
            font-size: 1.1em;
          }

          .view-all {
            font-weight: 600;
          }

          .drop-hover {
            color: #c9d1d9 !important;
            transition: all 0.2s ease;
          }

          .drop-hover:hover {
            background-color: #dc3545 !important;
            color: white !important;
            transform: translateX(5px);
          }

          /* Search Container */
          .search-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .search-custom {
            width: 250px;
            padding-right: 40px;
            transition: all 0.3s ease;
          }

          .search-custom:focus {
            background-color: #161b22 !important;
            border-color: #dc3545 !important;
            color: white !important;
            box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
            width: 280px;
          }

          .search-custom::placeholder {
            color: #8b949e;
          }

          .search-btn {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            color: #8b949e;
            cursor: pointer;
            padding: 5px;
            transition: color 0.3s ease;
          }

          .search-btn:hover {
            color: #dc3545;
          }

          /* Login Button */
          .btn-login {
            transition: all 0.3s ease;
            border: none;
          }

          .btn-login:hover {
            background-color: #b02a37;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220,53,69,0.4) !important;
          }

          /* Mobile Menu */
          @media (max-width: 991.98px) {
            .navbar-collapse {
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background-color: rgba(10, 11, 13, 0.95);
              backdrop-filter: blur(10px);
              border-top: 1px solid rgba(255,255,255,0.05);
              padding: 20px;
              transform: translateY(-100%);
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s ease;
            }

            .navbar-collapse.show {
              transform: translateY(0);
              opacity: 1;
              visibility: visible;
            }

            .nav-custom-hover {
              padding: 10px 0;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .search-custom {
              width: 100% !important;
            }

            .search-custom:focus {
              width: 100% !important;
            }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </Navbar>
  );
}

export default NavScroll;