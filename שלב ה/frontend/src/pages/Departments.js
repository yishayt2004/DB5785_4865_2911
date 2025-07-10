import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge, InputGroup } from 'react-bootstrap';
import axios from 'axios';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentname: '',
    description: '',
    establisheddate: ''
  });
  const [alert, setAlert] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('departmentname');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter and sort departments
  const filteredAndSortedDepartments = useMemo(() => {
    let filtered = departments.filter(department => {
      const nameMatch = department.departmentname.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = department.departmentid.toString().includes(searchTerm);
      
      return nameMatch || descMatch || idMatch;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'employee_count') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === 'establisheddate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [departments, searchTerm, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת המחלקות' });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await axios.put(`/api/departments/${editingDepartment.departmentid}`, formData);
        setAlert({ type: 'success', message: 'המחלקה עודכנה בהצלחה!' });
      } else {
        await axios.post('/api/departments', formData);
        setAlert({ type: 'success', message: 'המחלקה נוספה בהצלחה!' });
      }
      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בשמירת הנתונים' });
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מחלקה זו? זה עלול להשפיע על העובדים המשויכים אליה.')) {
      try {
        await axios.delete(`/api/departments/${departmentId}`);
        setAlert({ type: 'success', message: 'המחלקה נמחקה בהצלחה!' });
        fetchDepartments();
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה במחיקת המחלקה - ייתכן שיש עובדים המשויכים אליה' });
      }
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      departmentname: department.departmentname,
      description: department.description,
      establisheddate: department.establisheddate
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      departmentname: '',
      description: '',
      establisheddate: ''
    });
    setEditingDepartment(null);
  };

  if (loading) {
    return (
      <Container>
        <div className="loading-spinner">
          <Spinner animation="border" className="spinner-border-custom" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header className="bg-gradient text-white">
              <h4 className="mb-0">
                <i className="fas fa-sitemap me-2"></i>
                ניהול מחלקות
              </h4>
            </Card.Header>
            <Card.Body>
              {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                  {alert.message}
                </Alert>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>רשימת המחלקות ({filteredAndSortedDepartments.length})</h5>
                <Button 
                  variant="primary" 
                  className="btn-modern"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  הוסף מחלקה חדשה
                </Button>
              </div>

              {/* Search Control */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>חיפוש מחלקה</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="חפש לפי שם מחלקה, תיאור או מספר..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-modern"
                      />
                      <InputGroup.Text>
                        <i className="fas fa-search"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>מיון לפי</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="departmentname">שם מחלקה</option>
                      <option value="employee_count">מספר עובדים</option>
                      <option value="establisheddate">תאריך הקמה</option>
                      <option value="departmentid">מספר מחלקה</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>סדר</Form.Label>
                    <Form.Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="asc">עולה</option>
                      <option value="desc">יורד</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                {filteredAndSortedDepartments.length > 0 ? (
                  filteredAndSortedDepartments.map((dept) => (
                    <Col lg={4} md={6} className="mb-3" key={dept.departmentid}>
                      <Card className="h-100 card-modern">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title text-primary">
                              <i className="fas fa-building me-2"></i>
                              {dept.departmentname}
                            </h5>
                            <Badge bg="info" className="badge-modern">
                              {dept.employee_count} עובדים
                            </Badge>
                          </div>
                          
                          <p className="card-text text-muted">
                            {dept.description || 'אין תיאור'}
                          </p>
                          
                          <p className="card-text">
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              הוקמה: {new Date(dept.establisheddate).toLocaleDateString('he-IL')}
                            </small>
                          </p>
                          
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(dept)}
                            >
                              <i className="fas fa-edit me-1"></i>
                              ערוך
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(dept.departmentid)}
                            >
                              <i className="fas fa-trash me-1"></i>
                              מחק
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="text-center text-muted py-5">
                      <i className="fas fa-search fa-3x mb-3"></i>
                      <h5>{searchTerm ? 'לא נמצאו מחלקות העונות לחיפוש' : 'אין מחלקות'}</h5>
                      {searchTerm && (
                        <p>נסה לחפש עם מילות חיפוש אחרות</p>
                      )}
                    </div>
                  </Col>
                )}
              </Row>

              <div className="table-responsive">
                <Table className="table-modern" hover>
                  <thead>
                    <tr>
                      <th>מספר מחלקה</th>
                      <th>שם המחלקה</th>
                      <th>תיאור</th>
                      <th>תאריך הקמה</th>
                      <th>מספר עובדים</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.departmentid}>
                        <td>
                          <Badge bg="primary" className="badge-modern">
                            {dept.departmentid}
                          </Badge>
                        </td>
                        <td>{dept.departmentname}</td>
                        <td>{dept.description || 'אין תיאור'}</td>
                        <td>{new Date(dept.establisheddate).toLocaleDateString('he-IL')}</td>
                        <td>
                          <Badge bg="info" className="badge-modern">
                            {dept.employee_count}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(dept)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(dept.departmentid)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-modern">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDepartment ? 'עריכת מחלקה' : 'הוספת מחלקה חדשה'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>שם המחלקה</Form.Label>
              <Form.Control
                type="text"
                className="form-control-modern"
                value={formData.departmentname}
                onChange={(e) => setFormData({...formData, departmentname: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>תיאור</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="form-control-modern"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="תיאור המחלקה..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>תאריך הקמה</Form.Label>
              <Form.Control
                type="date"
                className="form-control-modern"
                value={formData.establisheddate}
                onChange={(e) => setFormData({...formData, establisheddate: e.target.value})}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ביטול
              </Button>
              <Button variant="primary" type="submit" className="btn-modern">
                {editingDepartment ? 'עדכן' : 'הוסף'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Departments;
