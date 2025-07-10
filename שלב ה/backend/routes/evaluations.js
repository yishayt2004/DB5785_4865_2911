const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// GET all evaluations with employee and department info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ev.*, e.firstname, e.lastname, d.departmentname
      FROM employeeevaluation ev
      JOIN employee e ON ev.employeeid = e.employeeid
      JOIN department d ON e.departmentid = d.departmentid
      ORDER BY ev.evaluationdate DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching evaluations:', err);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

// GET evaluation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT ev.*, e.firstname, e.lastname, d.departmentname
      FROM employeeevaluation ev
      JOIN employee e ON ev.employeeid = e.employeeid
      JOIN department d ON e.departmentid = d.departmentid
      WHERE ev.evaluationid = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching evaluation:', err);
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

// GET evaluations by employee ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await pool.query(`
      SELECT ev.*, e.firstname, e.lastname
      FROM employeeevaluation ev
      JOIN employee e ON ev.employeeid = e.employeeid
      WHERE ev.employeeid = $1
      ORDER BY ev.evaluationdate DESC
    `, [employeeId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employee evaluations:', err);
    res.status(500).json({ error: 'Failed to fetch employee evaluations' });
  }
});

// POST new evaluation
router.post('/', async (req, res) => {
  try {
    const { employeeid, evaluationdate, score, comments, nextreviewdate } = req.body;
    
    // Get next evaluation ID
    const maxIdResult = await pool.query('SELECT COALESCE(MAX(evaluationid), 0) + 1 as next_id FROM employeeevaluation');
    const nextId = maxIdResult.rows[0].next_id;
    
    const result = await pool.query(`
      INSERT INTO employeeevaluation (evaluationid, employeeid, evaluationdate, score, comments, nextreviewdate)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [nextId, employeeid, evaluationdate, score, comments, nextreviewdate]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating evaluation:', err);
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

// PUT update evaluation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeid, evaluationdate, score, comments, nextreviewdate } = req.body;
    
    const result = await pool.query(`
      UPDATE employeeevaluation 
      SET employeeid = $1, evaluationdate = $2, score = $3, comments = $4, nextreviewdate = $5
      WHERE evaluationid = $6
      RETURNING *
    `, [employeeid, evaluationdate, score, comments, nextreviewdate, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating evaluation:', err);
    res.status(500).json({ error: 'Failed to update evaluation' });
  }
});

// DELETE evaluation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM employeeevaluation WHERE evaluationid = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    
    res.json({ message: 'Evaluation deleted successfully', evaluation: result.rows[0] });
  } catch (err) {
    console.error('Error deleting evaluation:', err);
    res.status(500).json({ error: 'Failed to delete evaluation' });
  }
});

module.exports = router;
