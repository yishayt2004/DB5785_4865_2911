import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  const menuItems = [
    {
      title: 'ניהול עובדים',
      description: 'הוספה, עדכון, מחיקה וצפייה בפרטי עובדים',
      icon: 'fas fa-users',
      link: '/employees',
      color: '#667eea'
    },
    {
      title: 'ניהול מחלקות',
      description: 'ניהול מחלקות הארגון והעובדים בהן',
      icon: 'fas fa-sitemap',
      link: '/departments',
      color: '#764ba2'
    },
    {
      title: 'הערכות עובדים',
      description: 'מעקב אחר ביצועי העובדים והערכותיהם',
      icon: 'fas fa-chart-line',
      link: '/evaluations',
      color: '#f093fb'
    },
    {
      title: 'הכשרות',
      description: 'ניהול הכשרות והשתלמויות עובדים',
      icon: 'fas fa-graduation-cap',
      link: '/trainings',
      color: '#4facfe'
    },
    {
      title: 'דוחות ופעולות',
      description: 'הפעלת שאילתות, פונקציות ופרוצדורות',
      icon: 'fas fa-chart-bar',
      link: '/reports',
      color: '#43e97b'
    }
  ];

  return (
    <Container>
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <div className="bg-white rounded-4 p-5 shadow-lg">
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#333' }}>
              <i className="fas fa-building me-3" style={{ color: '#667eea' }}></i>
              מערכת ניהול משאבי אנוש
            </h1>
            <p className="lead text-muted mb-4">
              שלב ה' - ממשק גרפי מתקדם לעבודה מול בסיס הנתונים
            </p>
            <p className="text-muted">
              ברוכים הבאים למערכת ניהול משאבי האנוש המתקדמת. 
              המערכת מאפשרת ניהול מלא של עובדים, מחלקות, הערכות והכשרות,
              כולל הפעלת שאילתות מתקדמות ופונקציות מהשלבים הקודמים.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {menuItems.map((item, index) => (
          <Col lg={4} md={6} key={index}>
            <Link to={item.link} className="text-decoration-none">
              <div className="home-card">
                <i 
                  className={item.icon} 
                  style={{ color: item.color }}
                ></i>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col md={12}>
          <Card className="card-modern">
            <Card.Body className="text-center p-4">
              <h5 className="card-title">
                <i className="fas fa-info-circle me-2" style={{ color: '#667eea' }}></i>
                מידע על המערכת
              </h5>
              <p className="card-text text-muted">
                המערכת כוללת את כל הדרישות משלב ה':
              </p>
              <Row className="mt-3">
                <Col md={3}>
                  <div className="text-center">
                    <i className="fas fa-database fa-2x mb-2" style={{ color: '#667eea' }}></i>
                    <h6>פעולות CRUD</h6>
                    <small className="text-muted">על 3+ טבלאות</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <i className="fas fa-search fa-2x mb-2" style={{ color: '#764ba2' }}></i>
                    <h6>שאילתות</h6>
                    <small className="text-muted">משלב ב'</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <i className="fas fa-cogs fa-2x mb-2" style={{ color: '#f093fb' }}></i>
                    <h6>פונקציות</h6>
                    <small className="text-muted">משלב ד'</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <i className="fas fa-play fa-2x mb-2" style={{ color: '#43e97b' }}></i>
                    <h6>פרוצדורות</h6>
                    <small className="text-muted">משלב ד'</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
