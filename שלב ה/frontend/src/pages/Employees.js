import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge, InputGroup, Pagination } from 'react-bootstrap';
import axios from 'axios';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    salary: '',
    position: '',
    contactinfo: '',
    departmentid: ''
  });
  const [alert, setAlert] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('employeeid');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
      const searchMatch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeid.toString().includes(searchTerm);
      
      const departmentMatch = !departmentFilter || employee.departmentid.toString() === departmentFilter;
      
      return searchMatch && departmentMatch;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'salary') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'birthdate') {
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
  }, [employees, searchTerm, departmentFilter, sortBy, sortOrder]);

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת העובדים' });
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await axios.put(`/api/employees/${editingEmployee.employeeid}`, formData);
        setAlert({ type: 'success', message: 'העובד עודכן בהצלחה!' });
      } else {
        await axios.post('/api/employees', formData);
        setAlert({ type: 'success', message: 'העובד נוסף בהצלחה!' });
      }
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בשמירת הנתונים' });
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק עובד זה?')) {
      try {
        await axios.delete(`/api/employees/${employeeId}`);
        setAlert({ type: 'success', message: 'העובד נמחק בהצלחה!' });
        fetchEmployees();
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה במחיקת העובד' });
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstname: employee.firstname,
      lastname: employee.lastname,
      birthdate: employee.birthdate,
      salary: employee.salary,
      position: employee.position,
      contactinfo: employee.contactinfo,
      departmentid: employee.departmentid
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstname: '',
      lastname: '',
      birthdate: '',
      salary: '',
      position: '',
      contactinfo: '',
      departmentid: ''
    });
    setEditingEmployee(null);
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS' 
    }).format(salary);
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
                <i className="fas fa-users me-2"></i>
                ניהול עובדים
              </h4>
            </Card.Header>
            <Card.Body>
              {alert && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                  {alert.message}
                </Alert>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>רשימת העובדים ({filteredAndSortedEmployees.length})</h5>
                <Button 
                  variant="primary" 
                  className="btn-modern"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  הוסף עובד חדש
                </Button>
              </div>

              {/* Search and Filter Controls */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>חיפוש עובד</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="חפש לפי שם, תפקיד או מספר עובד..."
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
                    <Form.Label>סינון לפי מחלקה</Form.Label>
                    <Form.Select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="">כל המחלקות</option>
                      {departments.map((dept) => (
                        <option key={dept.departmentid} value={dept.departmentid}>
                          {dept.departmentname}
                        </option>
                      ))}
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
                      <option value="employeeid">מספר עובד</option>
                      <option value="firstname">שם פרטי</option>
                      <option value="lastname">שם משפחה</option>
                      <option value="salary">שכר</option>
                      <option value="position">תפקיד</option>
                      <option value="birthdate">תאריך לידה</option>
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
                        onClick={() => handleSort('employeeid')}
                      >
                        מספר עובד {sortBy === 'employeeid' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('firstname')}
                      >
                        שם פרטי {sortBy === 'firstname' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('lastname')}
                      >
                        שם משפחה {sortBy === 'lastname' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('birthdate')}
                      >
                        תאריך לידה {sortBy === 'birthdate' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('salary')}
                      >
                        שכר {sortBy === 'salary' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('position')}
                      >
                        תפקיד {sortBy === 'position' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>מחלקה</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.length > 0 ? (
                      paginatedEmployees.map((employee) => (
                        <tr key={employee.employeeid}>
                          <td>
                            <Badge bg="primary" className="badge-modern">
                              {employee.employeeid}
                            </Badge>
                          </td>
                          <td>{employee.firstname}</td>
                          <td>{employee.lastname}</td>
                          <td>{new Date(employee.birthdate).toLocaleDateString('he-IL')}</td>
                          <td>{formatSalary(employee.salary)}</td>
                          <td>{employee.position}</td>
                          <td>
                            <Badge bg="secondary" className="badge-modern">
                              {employee.departmentname || 'לא משויך'}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(employee)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(employee.employeeid)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          {searchTerm || departmentFilter ? 'לא נמצאו עובדים העונים לקריטריונים' : 'אין עובדים'}
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
                      // Show first, last, current, and adjacent pages
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
                  מציג {paginatedEmployees.length} מתוך {filteredAndSortedEmployees.length} עובדים
                  {currentPage > 1 && ` (דף ${currentPage} מתוך ${totalPages})`}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-modern">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmployee ? 'עריכת עובד' : 'הוספת עובד חדש'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>שם פרטי</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    value={formData.firstname}
                    onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>שם משפחה</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    value={formData.lastname}
                    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>תאריך לידה</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-modern"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>שכר</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-modern"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>תפקיד</Form.Label>
              <Form.Control
                type="text"
                className="form-control-modern"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>מחלקה</Form.Label>
              <Form.Select
                className="form-control-modern"
                value={formData.departmentid}
                onChange={(e) => setFormData({...formData, departmentid: e.target.value})}
                required
              >
                <option value="">בחר מחלקה</option>
                {departments.map((dept) => (
                  <option key={dept.departmentid} value={dept.departmentid}>
                    {dept.departmentname}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>פרטי קשר</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="form-control-modern"
                value={formData.contactinfo}
                onChange={(e) => setFormData({...formData, contactinfo: e.target.value})}
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
                {editingEmployee ? 'עדכן' : 'הוסף'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Employees;
