const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// GET all employees with department info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.departmentname 
      FROM employee e 
      LEFT JOIN department d ON e.departmentid = d.departmentid 
      ORDER BY e.employeeid
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, d.departmentname 
      FROM employee e 
      LEFT JOIN department d ON e.departmentid = d.departmentid 
      WHERE e.employeeid = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, birthdate, salary, position, contactinfo, departmentid } = req.body;
    
    // Get next employee ID
    const maxIdResult = await pool.query('SELECT COALESCE(MAX(employeeid), 0) + 1 as next_id FROM employee');
    const nextId = maxIdResult.rows[0].next_id;
    
    const result = await pool.query(`
      INSERT INTO employee (employeeid, firstname, lastname, birthdate, salary, position, contactinfo, departmentid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nextId, firstname, lastname, birthdate, salary, position, contactinfo, departmentid]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, birthdate, salary, position, contactinfo, departmentid } = req.body;
    
    const result = await pool.query(`
      UPDATE employee 
      SET firstname = $1, lastname = $2, birthdate = $3, salary = $4, 
          position = $5, contactinfo = $6, departmentid = $7
      WHERE employeeid = $8
      RETURNING *
    `, [firstname, lastname, birthdate, salary, position, contactinfo, departmentid, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    // Start transaction
    await client.query('BEGIN');
    
    // Delete related records first (due to foreign key constraints)
    await client.query('DELETE FROM employeetraining WHERE employeeid = $1', [id]);
    await client.query('DELETE FROM employeeevaluation WHERE employeeid = $1', [id]);
    await client.query('DELETE FROM payroll WHERE employeeid = $1', [id]);
    await client.query('DELETE FROM shiftschedule WHERE employeeid = $1', [id]);
    
    // Now delete the employee
    const result = await client.query('DELETE FROM employee WHERE employeeid = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
  } catch (err) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee: ' + err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
