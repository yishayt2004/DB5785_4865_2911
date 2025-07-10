import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge, ProgressBar, InputGroup, Pagination } from 'react-bootstrap';
import axios from 'axios';

function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [formData, setFormData] = useState({
    employeeid: '',
    evaluationdate: '',
    score: '',
    comments: '',
    nextreviewdate: ''
  });
  const [alert, setAlert] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [sortBy, setSortBy] = useState('evaluationdate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchEvaluations();
    fetchEmployees();
  }, []);

  // Filter and sort evaluations
  const filteredAndSortedEvaluations = useMemo(() => {
    let filtered = evaluations.filter(evaluation => {
      const employeeName = `${evaluation.firstname} ${evaluation.lastname}`.toLowerCase();
      const searchMatch = employeeName.includes(searchTerm.toLowerCase()) ||
                         evaluation.evaluationid.toString().includes(searchTerm) ||
                         evaluation.comments.toLowerCase().includes(searchTerm.toLowerCase());
      
      const scoreMatch = !scoreFilter || 
        (scoreFilter === 'excellent' && evaluation.score >= 90) ||
        (scoreFilter === 'good' && evaluation.score >= 80 && evaluation.score < 90) ||
        (scoreFilter === 'average' && evaluation.score >= 70 && evaluation.score < 80) ||
        (scoreFilter === 'poor' && evaluation.score < 70);
      
      const employeeMatch = !employeeFilter || evaluation.employeeid.toString() === employeeFilter;
      
      return searchMatch && scoreMatch && employeeMatch;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'score') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'evaluationdate' || sortBy === 'nextreviewdate') {
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
  }, [evaluations, searchTerm, scoreFilter, employeeFilter, sortBy, sortOrder]);

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredAndSortedEvaluations.length / itemsPerPage);
  const paginatedEvaluations = filteredAndSortedEvaluations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, scoreFilter, employeeFilter]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get('/api/evaluations');
      setEvaluations(response.data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת ההערכות' });
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
      if (editingEvaluation) {
        await axios.put(`/api/evaluations/${editingEvaluation.evaluationid}`, formData);
        setAlert({ type: 'success', message: 'ההערכה עודכנה בהצלחה!' });
      } else {
        await axios.post('/api/evaluations', formData);
        setAlert({ type: 'success', message: 'ההערכה נוספה בהצלחה!' });
      }
      setShowModal(false);
      resetForm();
      fetchEvaluations();
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בשמירת הנתונים' });
    }
  };

  const handleDelete = async (evaluationId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הערכה זו?')) {
      try {
        await axios.delete(`/api/evaluations/${evaluationId}`);
        setAlert({ type: 'success', message: 'ההערכה נמחקה בהצלחה!' });
        fetchEvaluations();
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה במחיקת ההערכה' });
      }
    }
  };

  const handleEdit = (evaluation) => {
    setEditingEvaluation(evaluation);
    setFormData({
      employeeid: evaluation.employeeid,
      evaluationdate: evaluation.evaluationdate,
      score: evaluation.score,
      comments: evaluation.comments,
      nextreviewdate: evaluation.nextreviewdate
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      employeeid: '',
      evaluationdate: '',
      score: '',
      comments: '',
      nextreviewdate: ''
    });
    setEditingEvaluation(null);
  };

  const getScoreVariant = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'מצוין';
    if (score >= 80) return 'טוב מאוד';
    if (score >= 70) return 'טוב';
    if (score >= 60) return 'בינוני';
    return 'דורש שיפור';
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
                <i className="fas fa-chart-line me-2"></i>
                ניהול הערכות עובדים
              </h4>
            </Card.Header>
            <Card.Body>
              {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                  {alert.message}
                </Alert>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>רשימת ההערכות ({filteredAndSortedEvaluations.length})</h5>
                <Button 
                  variant="primary" 
                  className="btn-modern"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  הוסף הערכה חדשה
                </Button>
              </div>

              {/* Search and Filter Controls */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>חיפוש הערכה</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="חפש לפי שם עובד, מספר הערכה או הערות..."
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
                    <Form.Label>סינון לפי עובד</Form.Label>
                    <Form.Select
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="">כל העובדים</option>
                      {employees.map((emp) => (
                        <option key={emp.employeeid} value={emp.employeeid}>
                          {emp.firstname} {emp.lastname}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>סינון לפי רמה</Form.Label>
                    <Form.Select
                      value={scoreFilter}
                      onChange={(e) => setScoreFilter(e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="">כל הרמות</option>
                      <option value="excellent">מצוין (90+)</option>
                      <option value="good">טוב (80-89)</option>
                      <option value="average">בינוני (70-79)</option>
                      <option value="poor">חלש (69-)</option>
                    </Form.Select>
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
                      <option value="evaluationdate">תאריך הערכה</option>
                      <option value="score">ציון</option>
                      <option value="firstname">שם עובד</option>
                      <option value="evaluationid">מספר הערכה</option>
                      <option value="nextreviewdate">תאריך סקירה הבא</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table className="table-modern" hover>
                  <thead>
                    <tr>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('evaluationid')}
                      >
                        מספר הערכה {sortBy === 'evaluationid' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('firstname')}
                      >
                        עובד {sortBy === 'firstname' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>מחלקה</th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('evaluationdate')}
                      >
                        תאריך הערכה {sortBy === 'evaluationdate' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('score')}
                      >
                        ציון {sortBy === 'score' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>רמה</th>
                      <th>הערות</th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('nextreviewdate')}
                      >
                        תאריך סקירה הבא {sortBy === 'nextreviewdate' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvaluations.length > 0 ? (
                      paginatedEvaluations.map((evaluation) => (
                        <tr key={evaluation.evaluationid}>
                          <td>
                            <Badge bg="primary" className="badge-modern">
                              {evaluation.evaluationid}
                            </Badge>
                          </td>
                          <td>
                            <strong>
                              {evaluation.firstname} {evaluation.lastname}
                            </strong>
                          </td>
                          <td>
                            <Badge bg="secondary" className="badge-modern">
                              {evaluation.departmentname}
                            </Badge>
                          </td>
                          <td>{new Date(evaluation.evaluationdate).toLocaleDateString('he-IL')}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2 fw-bold">{evaluation.score}</span>
                              <ProgressBar 
                                now={evaluation.score} 
                                variant={getScoreVariant(evaluation.score)}
                                style={{ width: '60px', height: '8px' }}
                              />
                            </div>
                          </td>
                          <td>
                            <Badge bg={getScoreVariant(evaluation.score)} className="badge-modern">
                              {getScoreLabel(evaluation.score)}
                            </Badge>
                          </td>
                          <td>
                            <span 
                              title={evaluation.comments}
                              style={{ 
                                maxWidth: '150px', 
                                display: 'inline-block', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {evaluation.comments || 'אין הערות'}
                            </span>
                          </td>
                          <td>
                            {evaluation.nextreviewdate ? 
                              new Date(evaluation.nextreviewdate).toLocaleDateString('he-IL') : 
                              'לא נקבע'
                            }
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(evaluation)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(evaluation.evaluationid)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          {searchTerm || scoreFilter || employeeFilter ? 'לא נמצאו הערכות העונות לקריטריונים' : 'אין הערכות'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                        return (
                          <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Pagination.Item>
                        );
                      } else if (Math.abs(page - currentPage) === 2) {
                        return <Pagination.Ellipsis key={page} />;
                      }
                      return null;
                    })}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}

              {/* Results info */}
              <div className="text-center text-muted mt-2">
                <small>
                  מציג {paginatedEvaluations.length} מתוך {filteredAndSortedEvaluations.length} הערכות
                  {currentPage > 1 && ` (דף ${currentPage} מתוך ${totalPages})`}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-modern" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEvaluation ? 'עריכת הערכה' : 'הוספת הערכה חדשה'}
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
                  <Form.Label>תאריך הערכה</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-modern"
                    value={formData.evaluationdate}
                    onChange={(e) => setFormData({...formData, evaluationdate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ציון (1-100)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    className="form-control-modern"
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                    required
                  />
                  {formData.score && (
                    <div className="mt-2">
                      <Badge bg={getScoreVariant(parseInt(formData.score))} className="badge-modern">
                        {getScoreLabel(parseInt(formData.score))}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>תאריך סקירה הבא</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-modern"
                    value={formData.nextreviewdate}
                    onChange={(e) => setFormData({...formData, nextreviewdate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>הערות</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="form-control-modern"
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                placeholder="הערות על ביצועי העובד..."
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
                {editingEvaluation ? 'עדכן' : 'הוסף'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Evaluations;
