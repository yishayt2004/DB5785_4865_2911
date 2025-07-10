const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// GET all trainings with employee info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, e.firstname, e.lastname, d.departmentname
      FROM employeetraining t
      JOIN employee e ON t.employeeid = e.employeeid
      JOIN department d ON e.departmentid = d.departmentid
      ORDER BY t.trainingdate DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trainings:', err);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

// GET training by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, e.firstname, e.lastname, d.departmentname
      FROM employeetraining t
      JOIN employee e ON t.employeeid = e.employeeid
      JOIN department d ON e.departmentid = d.departmentid
      WHERE t.trainingid = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching training:', err);
    res.status(500).json({ error: 'Failed to fetch training' });
  }
});

// GET trainings by employee ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await pool.query(`
      SELECT t.*, e.firstname, e.lastname
      FROM employeetraining t
      JOIN employee e ON t.employeeid = e.employeeid
      WHERE t.employeeid = $1
      ORDER BY t.trainingdate DESC
    `, [employeeId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employee trainings:', err);
    res.status(500).json({ error: 'Failed to fetch employee trainings' });
  }
});

// POST new training
router.post('/', async (req, res) => {
  try {
    const { employeeid, trainingname, trainingdate, completiondate, trainer } = req.body;
    
    // Get next training ID
    const maxIdResult = await pool.query('SELECT COALESCE(MAX(trainingid), 0) + 1 as next_id FROM employeetraining');
    const nextId = maxIdResult.rows[0].next_id;
    
    const result = await pool.query(`
      INSERT INTO employeetraining (trainingid, employeeid, trainingname, trainingdate, completiondate, trainer)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [nextId, employeeid, trainingname, trainingdate, completiondate, trainer]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating training:', err);
    res.status(500).json({ error: 'Failed to create training' });
  }
});

// PUT update training
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeid, trainingname, trainingdate, completiondate, trainer } = req.body;
    
    const result = await pool.query(`
      UPDATE employeetraining 
      SET employeeid = $1, trainingname = $2, trainingdate = $3, completiondate = $4, trainer = $5
      WHERE trainingid = $6
      RETURNING *
    `, [employeeid, trainingname, trainingdate, completiondate, trainer, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating training:', err);
    res.status(500).json({ error: 'Failed to update training' });
  }
});

// DELETE training
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM employeetraining WHERE trainingid = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json({ message: 'Training deleted successfully', training: result.rows[0] });
  } catch (err) {
    console.error('Error deleting training:', err);
    res.status(500).json({ error: 'Failed to delete training' });
  }
});

module.exports = router;
