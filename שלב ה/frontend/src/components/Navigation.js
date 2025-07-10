import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="fas fa-building me-2"></i>
          מערכת ניהול משאבי אנוש
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-home me-1"></i>
              דף הבית
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/employees" 
              className={location.pathname === '/employees' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-users me-1"></i>
              עובדים
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/departments" 
              className={location.pathname === '/departments' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-sitemap me-1"></i>
              מחלקות
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/evaluations" 
              className={location.pathname === '/evaluations' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-chart-line me-1"></i>
              הערכות
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/trainings" 
              className={location.pathname === '/trainings' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-graduation-cap me-1"></i>
              הכשרות
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/reports" 
              className={location.pathname === '/reports' ? 'active fw-bold' : ''}
            >
              <i className="fas fa-chart-bar me-1"></i>
              דוחות ופעולות
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
