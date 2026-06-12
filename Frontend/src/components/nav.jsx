import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../utils/authUtils';

function NavScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [loggedUserName, setLoggedUserName] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const handleLogout = useLogout();

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
      const sections = ['sedang-tayang', 'akan-datang'];
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleCityMenu = () => {
    setCityMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const loadUserName = () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        const storedAdmin = sessionStorage.getItem('admin');
        const role = sessionStorage.getItem('role');

        setUserRole(role || '');

        if (role === 'admin' && storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          setLoggedUserName(adminData?.username || '');
          return;
        }

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setLoggedUserName(userData?.nama || '');
          return;
        }

        setLoggedUserName('');
      } catch (error) {
        setLoggedUserName('');
      }
    };

    loadUserName();

    const handleStorage = (event) => {
      if (event.key === 'user' || event.key === 'admin' || event.key === 'role') {
        loadUserName();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isActive = (section) => {
    return location.pathname === '/' && activeSection === section ? 'active' : '';
  };

  return (
    <header
      className={`site-header fixed-top ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 11, 13, 0.95)' : '#0a0b0d',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        zIndex: 1030,
      }}
    >
      <div className="container-fluid py-2 px-lg-4 d-flex align-items-center justify-content-between flex-wrap">
        <Link to="/" className="navbar-brand fw-bold fs-3 logo-animation" style={{ letterSpacing: '1px' }}>
          <span style={{ color: '#dc3545' }}>Solo</span><span className="text-white">Flixx</span>
        </Link>

        <button
          className="mobile-menu-toggle border-0 bg-transparent text-white d-lg-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`site-nav-links d-lg-flex align-items-center ${isMobileMenuOpen ? 'show' : ''}`}>
          <div className="nav-items d-flex align-items-center gap-3">
          </div>

          <Link
            to={loggedUserName ? '#' : '/login'}
            onClick={(e) => loggedUserName && e.preventDefault()}
            className="btn btn-danger px-4 fw-bold rounded-pill btn-login shadow-sm d-inline-flex align-items-center"
            style={{ position: 'relative' }}
            onMouseEnter={() => loggedUserName && setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <span className="me-2">{userRole === 'admin' ? '🛡️' : '👤'}</span>
            {loggedUserName || 'Login'}
            {userRole === 'admin' && <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '0.65rem' }}>Admin</span>}
            
            {loggedUserName && (
              <div 
                className={`user-dropdown ${userMenuOpen ? 'show' : ''}`}
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'rgba(10, 11, 13, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: userMenuOpen ? 'block' : 'none',
                  minWidth: '180px',
                  zIndex: 1050,
                  padding: '8px 0'
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#c9d1d9',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc3545'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  className="user-dropdown-item"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Enhanced CSS (TETAP SAMA) */}
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

          .nav-dropdown {
            position: relative;
          }

          .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 180px;
            background-color: rgba(10, 11, 13, 0.95);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            margin-top: 8px;
            z-index: 1050;
            padding: 8px 0;
          }

          .dropdown-menu.show {
            display: block;
          }

          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 10px 16px;
            color: #c9d1d9;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .dropdown-item:hover {
            background-color: #dc3545;
            color: #fff;
            transform: translateX(2px);
          }

          .dropdown-divider {
            height: 1px;
            background-color: rgba(255,255,255,0.1);
            margin: 4px 0;
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

          .btn-login {
            transition: all 0.3s ease;
            border: none;
          }

          .btn-login:hover {
            background-color: #b02a37;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220,53,69,0.4) !important;
          }

          @media (max-width: 991.98px) {
            .site-nav-links {
              display: none;
              flex-direction: column;
              width: 100%;
              padding: 16px 0;
            }

            .site-nav-links.show {
              display: flex;
            }

            .nav-items {
              flex-direction: column;
              width: 100%;
              gap: 0.5rem;
            }

            .nav-custom-hover {
              width: 100%;
              padding: 10px 0;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .nav-dropdown .dropdown-menu {
              position: static;
              border: none;
              backdrop-filter: none;
              background-color: transparent;
              box-shadow: none;
              padding: 0;
            }

            .dropdown-item {
              padding-left: 0;
            }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </header>
  );
}

export default NavScroll;