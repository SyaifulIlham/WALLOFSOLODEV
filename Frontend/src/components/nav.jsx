import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavScroll() {
  return (
    <Navbar expand="lg" className="bg-primary" variant="dark" style={{ width: '100%'}}>
      <Container fluid>
        <Navbar.Brand href="#" className="text-warning fw-bold">SoloFlixx</Navbar.Brand>
<Navbar.Toggle aria-controls="navbarScroll" />
<Navbar.Collapse id="navbarScroll">
  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
    <Nav.Link className="text-warning fw-bold" href="#movies">Sedang Tayang</Nav.Link>
    <Nav.Link className="text-warning fw-bold" href="#upcoming">Akan Datang</Nav.Link>
    {/* Dropdown untuk Lokasi atau Kategori */}
    <NavDropdown menuVariant="dark" title={<span className="text-warning fw-bold">Kota</span>} id="navbarScrollingDropdown">
      <NavDropdown.Item className="text-warning fw-bold" href="#jakarta">Jakarta</NavDropdown.Item>
      <NavDropdown.Item className="text-warning fw-bold" href="#bandung">Bandung</NavDropdown.Item>
      <NavDropdown.Item className="text-warning fw-bold" href="#surabaya">Surabaya</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item className="text-warning fw-bold" href="#all-cities">Lihat Semua Kota</NavDropdown.Item>
    </NavDropdown>

    <Nav.Link className="text-warning fw-bold" href="#promo">Promo</Nav.Link>
  </Nav>

  <Form className="d-flex align-items-center">
    <Form.Control
      type="search"
      placeholder="Cari film atau bioskop..."
      className="me-2"
      aria-label="Search"
    />
    {/* Mengganti tombol Login menjadi lebih mencolok atau pakai warna Brand */}
    <Button variant="danger" className="px-4 fw-semibold">Login</Button>
  </Form>
</Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScroll;