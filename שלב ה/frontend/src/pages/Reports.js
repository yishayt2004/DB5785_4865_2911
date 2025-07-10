import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner, Badge, Form } from 'react-bootstrap';
import axios from 'axios';

function Reports() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  // States for different reports
  const [topPerformers, setTopPerformers] = useState([]);
  const [evaluationsByDept, setEvaluationsByDept] = useState([]);
  const [untrainedEmployees, setUntrainedEmployees] = useState([]);
  const [employeeAvgScore, setEmployeeAvgScore] = useState(null);
  const [salaryStats, setSalaryStats] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const showLoading = (action) => {
    setLoading(true);
    setAlert({ type: 'info', message: `מריץ ${action}...` });
  };

  const hideLoading = () => {
    setLoading(false);
  };

  // Query 1: Top performers (from stage 2)
  const fetchTopPerformers = async () => {
    showLoading('שאילתה: עובדים מצטיינים');
    try {
      const response = await axios.get('/api/reports/top-performers');
      setTopPerformers(response.data);
      setAlert({ type: 'success', message: `נמצאו ${response.data.length} עובדים מצטיינים (ציון 90+)` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת עובדים מצטיינים' });
    }
    hideLoading();
  };

  // Query 2: Evaluations by department (from stage 2)
  const fetchEvaluationsByDept = async () => {
    showLoading('שאילתה: הערכות לפי מחלקה');
    try {
      const response = await axios.get('/api/reports/evaluations-by-department');
      console.log('Evaluations by department response:', response.data);
      setEvaluationsByDept(response.data);
      
      if (response.data.length > 0) {
        setAlert({ type: 'success', message: `נמצאו ${response.data.length} מחלקות עם הערכות` });
      } else {
        setAlert({ type: 'info', message: 'לא נמצאו הערכות במערכת' });
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'שגיאה בטעינת דוח הערכות לפי מחלקה';
      setAlert({ type: 'danger', message: errorMessage });
      setEvaluationsByDept([]);
    }
    hideLoading();
  };

  // Function 1: Get untrained employees (from stage 4)
  const fetchUntrainedEmployees = async () => {
    showLoading('פונקציה: עובדים ללא הכשרה');
    try {
      const response = await axios.get('/api/reports/untrained-employees');
      setUntrainedEmployees(response.data);
      setAlert({ type: 'success', message: `נמצאו ${response.data.length} עובדים שטרם עברו הכשרה` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת עובדים ללא הכשרה' });
    }
    hideLoading();
  };

  // Function 2: Get employee average score (from stage 4)
  const fetchEmployeeAvgScore = async () => {
    if (!selectedEmployeeId) {
      setAlert({ type: 'warning', message: 'יש לבחור עובד תחילה' });
      return;
    }

    showLoading('פונקציה: ממוצע ציונים לעובד');
    try {
      const response = await axios.get(`/api/reports/employee-avg-score/${selectedEmployeeId}`);
      const selectedEmployee = employees.find(e => e.employeeid === parseInt(selectedEmployeeId));
      
      setEmployeeAvgScore({
        employeeId: selectedEmployeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}` : 'עובד לא ידוע',
        avgScore: response.data.avg_score,
        message: response.data.message
      });
      
      if (response.data.avg_score) {
        setAlert({ type: 'success', message: `ממוצע הציונים לעובד חושב בהצלחה: ${response.data.avg_score}` });
      } else {
        setAlert({ type: 'info', message: response.data.message || 'לא נמצאו הערכות לעובד זה' });
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'שגיאה בחישוב ממוצע הציונים';
      setAlert({ type: 'danger', message: errorMessage });
      setEmployeeAvgScore(null);
    }
    hideLoading();
  };

  // Procedure 1: Raise high performer salaries (from stage 4)
  const raiseHighPerformerSalaries = async () => {
    if (window.confirm('האם אתה בטוח שברצונך להעלות שכר לעובדים מצטיינים? פעולה זו תשפיע על בסיס הנתונים.')) {
      showLoading('פרוצדורה: העלאת שכר למצטיינים');
      try {
        await axios.post('/api/reports/raise-high-performer-salaries');
        setAlert({ type: 'success', message: 'שכרם של העובדים המצטיינים הועלה בהצלחה!' });
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה בהעלאת שכר עובדים מצטיינים' });
      }
      hideLoading();
    }
  };

  // Procedure 2: Reduce salary for low scores (from stage 4)
  const reduceSalaryLowScores = async () => {
    if (window.confirm('האם אתה בטוח שברצונך להפחית שכר לעובדים בעלי ציונים נמוכים? פעולה זו תשפיע על בסיס הנתונים.')) {
      showLoading('פרוצדורה: הפחתת שכר לציונים נמוכים');
      try {
        await axios.post('/api/reports/reduce-low-score-salaries');
        setAlert({ type: 'success', message: 'שכרם של העובדים בעלי הציונים הנמוכים הופחת בהצלחה!' });
      } catch (error) {
        setAlert({ type: 'danger', message: 'שגיאה בהפחתת שכר עובדים' });
      }
      hideLoading();
    }
  };

  // Additional reports
  const fetchSalaryStats = async () => {
    showLoading('דוח נוסף: סטטיסטיקות שכר');
    try {
      const response = await axios.get('/api/reports/salary-statistics');
      setSalaryStats(response.data);
      setAlert({ type: 'success', message: 'סטטיסטיקות שכר נטענו בהצלחה' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת סטטיסטיקות שכר' });
    }
    hideLoading();
  };

  const fetchPerformanceSummary = async () => {
    showLoading('דוח נוסף: סיכום ביצועים');
    try {
      const response = await axios.get('/api/reports/performance-summary');
      setPerformanceSummary(response.data);
      setAlert({ type: 'success', message: 'דוח סיכום ביצועים נטען בהצלחה' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'שגיאה בטעינת דוח ביצועים' });
    }
    hideLoading();
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS' 
    }).format(salary);
  };

  return (
    <Container>
      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="alert-modern">
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header className="bg-gradient text-white">
              <h4 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                דוחות ופעולות מתקדמות
              </h4>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                מסך זה מאפשר הפעלת שאילתות משלב ב', פונקציות ופרוצדורות משלב ד', ודוחות נוספים.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Queries from Stage 2 */}
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-search me-2"></i>
                שאילתות משלב ב'
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className="btn-modern"
                      onClick={fetchTopPerformers}
                      disabled={loading}
                    >
                      <i className="fas fa-star me-2"></i>
                      עובדים מצטיינים (ציון 90+)
                    </Button>
                    
                    <Button 
                      variant="info" 
                      className="btn-modern"
                      onClick={fetchEvaluationsByDept}
                      disabled={loading}
                    >
                      <i className="fas fa-building me-2"></i>
                      הערכות לפי מחלקה
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  {topPerformers.length > 0 && (
                    <div>
                      <h6>עובדים מצטיינים:</h6>
                      <div className="table-responsive">
                        <Table size="sm" className="table-modern">
                          <thead>
                            <tr>
                              <th>שם</th>
                              <th>מחלקה</th>
                              <th>ציון</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topPerformers.slice(0, 5).map((emp, index) => (
                              <tr key={index}>
                                <td>{emp.firstname} {emp.lastname}</td>
                                <td>{emp.departmentname}</td>
                                <td>
                                  <Badge bg="success" className="badge-modern">
                                    {emp.score}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Functions from Stage 4 */}
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                פונקציות משלב ד'
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-grid gap-2 mb-3">
                    <Button 
                      variant="warning" 
                      className="btn-modern"
                      onClick={fetchUntrainedEmployees}
                      disabled={loading}
                    >
                      <i className="fas fa-graduation-cap me-2"></i>
                      עובדים ללא הכשרה
                    </Button>
                    
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="form-control-modern"
                      >
                        <option value="">בחר עובד לחישוב ממוצע</option>
                        {employees.map((emp) => (
                          <option key={emp.employeeid} value={emp.employeeid}>
                            {emp.firstname} {emp.lastname}
                          </option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="secondary" 
                        onClick={fetchEmployeeAvgScore}
                        disabled={loading || !selectedEmployeeId}
                      >
                        חשב ממוצע
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  {untrainedEmployees.length > 0 && (
                    <div className="mb-3">
                      <h6>עובדים ללא הכשרה ({untrainedEmployees.length}):</h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {untrainedEmployees.map((emp, index) => (
                          <Badge key={index} bg="warning" className="badge-modern me-1 mb-1">
                            {emp.firstname} {emp.lastname}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {employeeAvgScore && (
                    <div>
                      <h6>ממוצע ציונים:</h6>
                      <Card className="bg-light">
                        <Card.Body>
                          <h5>{employeeAvgScore.employeeName}</h5>
                          <h3 className="text-primary">
                            {employeeAvgScore.avgScore !== null ? 
                              `${employeeAvgScore.avgScore}` : 
                              'אין הערכות'
                            }
                          </h3>
                          {employeeAvgScore.message && (
                            <p className="text-muted small">{employeeAvgScore.message}</p>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Procedures from Stage 4 */}
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-play me-2"></i>
                פרוצדורות משלב ד'
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>שים לב:</strong> הפעלת הפרוצדורות תשנה נתונים בבסיס הנתונים!
              </div>
              
              <Row>
                <Col md={6}>
                  <div className="d-grid">
                    <Button 
                      variant="success" 
                      className="btn-modern"
                      onClick={raiseHighPerformerSalaries}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-up me-2"></i>
                      העלה שכר לעובדים מצטיינים
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-grid">
                    <Button 
                      variant="danger" 
                      className="btn-modern"
                      onClick={reduceSalaryLowScores}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-down me-2"></i>
                      הפחת שכר לציונים נמוכים
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Reports */}
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                דוחות נוספים
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      className="btn-modern"
                      onClick={fetchSalaryStats}
                      disabled={loading}
                    >
                      <i className="fas fa-money-bill me-2"></i>
                      סטטיסטיקות שכר לפי מחלקה
                    </Button>
                    
                    <Button 
                      variant="outline-info" 
                      className="btn-modern"
                      onClick={fetchPerformanceSummary}
                      disabled={loading}
                    >
                      <i className="fas fa-chart-line me-2"></i>
                      סיכום ביצועים כללי
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  {evaluationsByDept.length > 0 ? (
                    <div>
                      <h6>הערכות לפי מחלקה:</h6>
                      <div className="table-responsive">
                        <Table size="sm" className="table-modern">
                          <thead>
                            <tr>
                              <th>מחלקה</th>
                              <th>מספר הערכות</th>
                            </tr>
                          </thead>
                          <tbody>
                            {evaluationsByDept.map((dept, index) => (
                              <tr key={index}>
                                <td>{dept.departmentname}</td>
                                <td>
                                  <Badge bg="info" className="badge-modern">
                                    {dept.num_evaluations}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted">
                      <i className="fas fa-chart-bar fa-2x mb-2"></i>
                      <p>לחץ על הכפתור "הערכות לפי מחלקה" להצגת הנתונים</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <Spinner animation="border" className="spinner-border-custom" />
        </div>
      )}

      {/* Salary Statistics Table */}
      {salaryStats.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="card-modern">
              <Card.Header>
                <h5 className="mb-0">סטטיסטיקות שכר לפי מחלקה</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table className="table-modern" hover>
                    <thead>
                      <tr>
                        <th>מחלקה</th>
                        <th>מספר עובדים</th>
                        <th>שכר ממוצע</th>
                        <th>שכר מינימלי</th>
                        <th>שכר מקסימלי</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryStats.map((stat, index) => (
                        <tr key={index}>
                          <td>{stat.departmentname}</td>
                          <td>
                            <Badge bg="secondary" className="badge-modern">
                              {stat.employee_count}
                            </Badge>
                          </td>
                          <td>{stat.avg_salary ? formatSalary(stat.avg_salary) : 'N/A'}</td>
                          <td>{stat.min_salary ? formatSalary(stat.min_salary) : 'N/A'}</td>
                          <td>{stat.max_salary ? formatSalary(stat.max_salary) : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Performance Summary Table */}
      {performanceSummary.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="card-modern">
              <Card.Header>
                <h5 className="mb-0">סיכום ביצועים כללי</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table className="table-modern" hover>
                    <thead>
                      <tr>
                        <th>עובד</th>
                        <th>מחלקה</th>
                        <th>מספר הערכות</th>
                        <th>ממוצע ציונים</th>
                        <th>מספר הכשרות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceSummary.slice(0, 10).map((summary, index) => (
                        <tr key={index}>
                          <td>{summary.firstname} {summary.lastname}</td>
                          <td>
                            <Badge bg="secondary" className="badge-modern">
                              {summary.departmentname}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="info" className="badge-modern">
                              {summary.evaluation_count}
                            </Badge>
                          </td>
                          <td>
                            {summary.avg_score ? (
                              <Badge 
                                bg={summary.avg_score >= 90 ? 'success' : summary.avg_score >= 80 ? 'info' : 'warning'} 
                                className="badge-modern"
                              >
                                {parseFloat(summary.avg_score).toFixed(1)}
                              </Badge>
                            ) : (
                              <span className="text-muted">אין הערכות</span>
                            )}
                          </td>
                          <td>
                            <Badge bg="primary" className="badge-modern">
                              {summary.training_count}
                            </Badge>
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
      )}
    </Container>
  );
}

export default Reports;
