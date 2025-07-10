const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// Query 1: Top performers (from stage 2)
router.get('/top-performers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM HR_Employee_Evaluation_View
      WHERE score >= 90
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top performers:', err);
    res.status(500).json({ error: 'Failed to fetch top performers' });
  }
});

// Query 2: Evaluations by department (from stage 2)
router.get('/evaluations-by-department', async (req, res) => {
  try {
    let result;
    try {
      // Try to use the view first
      result = await pool.query(`
        SELECT departmentname, COUNT(*) AS num_evaluations
        FROM HR_Employee_Evaluation_View
        GROUP BY departmentname
        ORDER BY num_evaluations DESC
      `);
    } catch (viewError) {
      console.log('View not found, using direct query:', viewError.message);
      // Fallback to direct query if view doesn't exist
      result = await pool.query(`
        SELECT 
          d.departmentname, 
          COUNT(ev.evaluationid) AS num_evaluations
        FROM department d
        LEFT JOIN employee e ON d.departmentid = e.departmentid
        LEFT JOIN employeeevaluation ev ON e.employeeid = ev.employeeid
        WHERE ev.evaluationid IS NOT NULL
        GROUP BY d.departmentid, d.departmentname
        ORDER BY num_evaluations DESC
      `);
    }
    
    // Add a message about the data
    const responseData = result.rows.map(row => ({
      ...row,
      num_evaluations: parseInt(row.num_evaluations) || 0
    }));
    
    console.log('Evaluations by department result:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Error fetching evaluations by department:', err);
    res.status(500).json({ error: 'Failed to fetch evaluations by department: ' + err.message });
  }
});

// Function 1: Get untrained employees (from stage 4)
router.get('/untrained-employees', async (req, res) => {
  try {
    let result;
    try {
      result = await pool.query('SELECT * FROM GetUntrainedEmployees()');
    } catch (funcError) {
      console.log('Function not found, using direct query:', funcError.message);
      // Fallback to direct query if function doesn't exist
      result = await pool.query(`
        SELECT e.employeeid, e.firstname, e.lastname, e.position, d.departmentname
        FROM employee e
        LEFT JOIN department d ON e.departmentid = d.departmentid
        WHERE e.employeeid NOT IN (
          SELECT DISTINCT employeeid
          FROM employeetraining
          WHERE employeeid IS NOT NULL
        )
        ORDER BY e.employeeid
      `);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching untrained employees:', err);
    res.status(500).json({ error: 'Failed to fetch untrained employees: ' + err.message });
  }
});

// Function 2: Get employee average score (from stage 4)
router.get('/employee-avg-score/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // First check if employee exists
    const employeeCheck = await pool.query('SELECT * FROM employee WHERE employeeid = $1', [employeeId]);
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Try to use the function
    let result;
    try {
      result = await pool.query('SELECT GetEmployeeAvgScore($1) as avg_score', [employeeId]);
    } catch (funcError) {
      console.log('Function not found, using direct query:', funcError.message);
      // Fallback to direct query if function doesn't exist
      result = await pool.query(`
        SELECT AVG(score) as avg_score 
        FROM employeeevaluation 
        WHERE employeeid = $1
      `, [employeeId]);
    }
    
    const avgScore = result.rows[0].avg_score;
    
    res.json({ 
      avg_score: avgScore ? parseFloat(avgScore).toFixed(2) : null,
      message: avgScore ? 'Average calculated successfully' : 'No evaluations found for this employee'
    });
  } catch (err) {
    console.error('Error fetching employee average score:', err);
    res.status(500).json({ error: 'Failed to fetch employee average score: ' + err.message });
  }
});

// Procedure 1: Raise salary for high performers (from stage 4)
router.post('/raise-high-performer-salaries', async (req, res) => {
  try {
    await pool.query('CALL RaiseHighPerformerSalaries()');
    res.json({ success: true, message: 'High performer salaries raised successfully' });
  } catch (err) {
    console.error('Error raising high performer salaries:', err);
    res.status(500).json({ error: 'Failed to raise high performer salaries' });
  }
});

// Procedure 2: Reduce salary for low scores (from stage 4)
router.post('/reduce-low-score-salaries', async (req, res) => {
  try {
    await pool.query('CALL ReduceSalaryForLowScores()');
    res.json({ success: true, message: 'Low score salaries reduced successfully' });
  } catch (err) {
    console.error('Error reducing low score salaries:', err);
    res.status(500).json({ error: 'Failed to reduce low score salaries' });
  }
});

// Additional useful reports
router.get('/salary-statistics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.departmentname,
        COUNT(e.employeeid) as employee_count,
        AVG(e.salary) as avg_salary,
        MIN(e.salary) as min_salary,
        MAX(e.salary) as max_salary
      FROM department d
      LEFT JOIN employee e ON d.departmentid = e.departmentid
      GROUP BY d.departmentid, d.departmentname
      ORDER BY avg_salary DESC NULLS LAST
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching salary statistics:', err);
    res.status(500).json({ error: 'Failed to fetch salary statistics' });
  }
});

// Employee performance summary
router.get('/performance-summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.employeeid,
        e.firstname,
        e.lastname,
        d.departmentname,
        COUNT(ev.evaluationid) as evaluation_count,
        AVG(ev.score) as avg_score,
        COUNT(t.trainingid) as training_count
      FROM employee e
      LEFT JOIN department d ON e.departmentid = d.departmentid
      LEFT JOIN employeeevaluation ev ON e.employeeid = ev.employeeid
      LEFT JOIN employeetraining t ON e.employeeid = t.employeeid
      GROUP BY e.employeeid, e.firstname, e.lastname, d.departmentname
      ORDER BY avg_score DESC NULLS LAST
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching performance summary:', err);
    res.status(500).json({ error: 'Failed to fetch performance summary' });
  }
});

module.exports = router;
