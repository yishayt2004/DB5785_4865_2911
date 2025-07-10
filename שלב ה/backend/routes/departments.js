const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// GET all departments with employee count
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, COUNT(e.employeeid) as employee_count
      FROM department d
      LEFT JOIN employee e ON d.departmentid = e.departmentid
      GROUP BY d.departmentid, d.departmentname, d.description, d.establisheddate
      ORDER BY d.departmentname
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// GET department by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM department WHERE departmentid = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

// POST new department
router.post('/', async (req, res) => {
  try {
    const { departmentname, description, establisheddate } = req.body;
    
    // Get next department ID
    const maxIdResult = await pool.query('SELECT COALESCE(MAX(departmentid), 0) + 1 as next_id FROM department');
    const nextId = maxIdResult.rows[0].next_id;
    
    const result = await pool.query(`
      INSERT INTO department (departmentid, departmentname, description, establisheddate)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nextId, departmentname, description, establisheddate]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating department:', err);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// PUT update department
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentname, description, establisheddate } = req.body;
    
    const result = await pool.query(`
      UPDATE department 
      SET departmentname = $1, description = $2, establisheddate = $3
      WHERE departmentid = $4
      RETURNING *
    `, [departmentname, description, establisheddate, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// DELETE department
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM department WHERE departmentid = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully', department: result.rows[0] });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

module.exports = router;
