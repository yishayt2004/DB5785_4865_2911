import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [formData, setFormData] = useState({
    employeeid: '',
    trainingname: '',
    trainingdate: '',
    completiondate: '',
    trainer: ''
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchTrainings();
    fetchEmployees();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get('/api/trainings');
      setTrainings(response.data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת ההכשרות' });
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTraining) {
        await axios.put(`/api/trainings/${editingTraining.trainingid}`, formData);
        setAlert({ type: 'success', message: 'ההכשרה עודכנה בהצלחה!' });
      } else {
        await axios.post('/api/trainings', formData);
        setAlert({ type: 'success', message: 'ההכשרה נוספה בהצלחה!' });
      }
      setShowModal(false);
      resetForm();
      fetchTrainings();
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בשמירת הנתונים' });
    }
  };

  const handleDelete = async (trainingId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הכשרה זו?')) {
      try {
        await axios.delete(`/api/trainings/${trainingId}`);
        setAlert({ type: 'success', message: 'ההכשרה נמחקה בהצלחה!' });
        fetchTrainings();
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה במחיקת ההכשרה' });
      }
    }
  };

  const handleEdit = (training) => {
    setEditingTraining(training);
    setFormData({
      employeeid: training.employeeid,
      trainingname: training.trainingname,
      trainingdate: training.trainingdate,
      completiondate: training.completiondate,
      trainer: training.trainer
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      employeeid: '',
      trainingname: '',
      trainingdate: '',
      completiondate: '',
      trainer: ''
    });
    setEditingTraining(null);
  };

  const getTrainingStatus = (trainingDate, completionDate) => {
    const today = new Date();
    const training = new Date(trainingDate);
    const completion = completionDate ? new Date(completionDate) : null;

    if (completion) {
      return { variant: 'success', text: 'הושלם' };
    } else if (training > today) {
      return { variant: 'info', text: 'מתוכנן' };
    } else {
      return { variant: 'warning', text: 'בתהליך' };
    }
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
                <i className="fas fa-graduation-cap me-2"></i>
                ניהול הכשרות והשתלמויות
              </h4>
            </Card.Header>
            <Card.Body>
              {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                  {alert.message}
                </Alert>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>רשימת ההכשרות ({trainings.length})</h5>
                <Button 
                  variant="primary" 
                  className="btn-modern"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  הוסף הכשרה חדשה
                </Button>
              </div>

              <div className="table-responsive">
                <Table className="table-modern" hover>
                  <thead>
                    <tr>
                      <th>מספר הכשרה</th>
                      <th>עובד</th>
                      <th>מחלקה</th>
                      <th>שם ההכשרה</th>
                      <th>תאריך התחלה</th>
                      <th>תאריך סיום</th>
                      <th>מדריך</th>
                      <th>סטטוס</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainings.map((training) => {
                      const status = getTrainingStatus(training.trainingdate, training.completiondate);
                      return (
                        <tr key={training.trainingid}>
                          <td>
                            <Badge bg="primary" className="badge-modern">
                              {training.trainingid}
                            </Badge>
                          </td>
                          <td>
                            <strong>
                              {training.firstname} {training.lastname}
                            </strong>
                          </td>
                          <td>
                            <Badge bg="secondary" className="badge-modern">
                              {training.departmentname}
                            </Badge>
                          </td>
                          <td>
                            <strong>{training.trainingname}</strong>
                          </td>
                          <td>{new Date(training.trainingdate).toLocaleDateString('he-IL')}</td>
                          <td>
                            {training.completiondate ? 
                              new Date(training.completiondate).toLocaleDateString('he-IL') : 
                              <span className="text-muted">לא הושלם</span>
                            }
                          </td>
                          <td>{training.trainer}</td>
                          <td>
                            <Badge bg={status.variant} className="badge-modern">
                              {status.text}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(training)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(training.trainingid)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-modern" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTraining ? 'עריכת הכשרה' : 'הוספת הכשרה חדשה'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>עובד</Form.Label>
                  <Form.Select
                    className="form-control-modern"
                    value={formData.employeeid}
                    onChange={(e) => setFormData({...formData, employeeid: e.target.value})}
                    required
                  >
                    <option value="">בחר עובד</option>
                    {employees.map((employee) => (
                      <option key={employee.employeeid} value={employee.employeeid}>
                        {employee.firstname} {employee.lastname} - {employee.departmentname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>שם ההכשרה</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    value={formData.trainingname}
                    onChange={(e) => setFormData({...formData, trainingname: e.target.value})}
                    placeholder="למשל: הכשרה בבטיחות, קורס מחשבים..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>תאריך התחלה</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-modern"
                    value={formData.trainingdate}
                    onChange={(e) => setFormData({...formData, trainingdate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>תאריך סיום (אופציונלי)</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-modern"
                    value={formData.completiondate}
                    onChange={(e) => setFormData({...formData, completiondate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>מדריך/מרצה</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    placeholder="שם המדריך או המרצה"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

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
                {editingTraining ? 'עדכן' : 'הוסף'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Trainings;
