
-- ==========================
-- SELECT Queries
-- ==========================

-- 1. Average salary per department
SELECT d.DepartmentName, ROUND(AVG(e.Salary), 2) AS AvgSalary
FROM Employee e
JOIN Department d ON e.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentName
ORDER BY AvgSalary DESC;

-- 2. Employees with evaluation score under 60 this year
SELECT e.FirstName, e.LastName, ev.Score, ev.EvaluationDate
FROM EmployeeEvaluation ev
JOIN Employee e ON ev.EmployeeID = e.EmployeeID
WHERE ev.Score < 60 AND EXTRACT(YEAR FROM ev.EvaluationDate) = EXTRACT(YEAR FROM CURRENT_DATE);

-- 3. Trainings from current 10 years
SELECT e.FirstName, e.LastName, t.TrainingName, t.TrainingDate
FROM EmployeeTraining t
JOIN Employee e ON t.EmployeeID = e.EmployeeID
WHERE EXTRACT(YEAR FROM t.TrainingDate) = EXTRACT(YEAR FROM CURRENT_DATE);

-- 4. Number of trained employees per department
SELECT d.DepartmentName, COUNT(DISTINCT t.EmployeeID) AS TrainedEmployees
FROM EmployeeTraining t
JOIN Employee e ON t.EmployeeID = e.EmployeeID
JOIN Department d ON e.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentName;


-- 5. Employees with over 60 days since first payment
SELECT DISTINCT e.EmployeeID, e.FirstName, e.LastName, MIN(p.PaymentDate) AS FirstPayment
FROM Payroll p
JOIN Employee e ON p.EmployeeID = e.EmployeeID
GROUP BY e.EmployeeID, e.FirstName, e.LastName
HAVING MIN(p.PaymentDate) <= CURRENT_DATE - INTERVAL '60 days';

-- 6. Employees who never received training
SELECT e.EmployeeID, e.FirstName, e.LastName
FROM Employee e
WHERE NOT EXISTS (
    SELECT 1 FROM EmployeeTraining t WHERE t.EmployeeID = e.EmployeeID
);

-- 7. Daily shift hours
SELECT s.ShiftID, e.FirstName, e.LastName,
       s.ShiftDate, s.StartTime, s.EndTime,
       EXTRACT(EPOCH FROM (s.EndTime - s.StartTime)) / 3600 AS ShiftHours
FROM ShiftSchedule s
JOIN Employee e ON s.EmployeeID = e.EmployeeID;

-- 8. Net salary comparison for high earners
SELECT e.FirstName, e.LastName, p.SalaryPaid, p.Deductions,
       (p.SalaryPaid - p.Deductions) AS NetSalary
FROM Payroll p
JOIN Employee e ON p.EmployeeID = e.EmployeeID
WHERE p.SalaryPaid > 10000
ORDER BY NetSalary DESC;

-- ==========================
-- UPDATE Queries
-- ==========================

-- 1. Raise salary by 10% for employees who got paid more than a year ago
UPDATE Employee
SET Salary = Salary * 1.1
WHERE EmployeeID IN (
    SELECT e.EmployeeID
    FROM Employee e
    JOIN Payroll p ON e.EmployeeID = p.EmployeeID
    GROUP BY e.EmployeeID
    HAVING MIN(p.PaymentDate) < CURRENT_DATE - INTERVAL '1 year'
);

-- 2. Boost evaluation score by 5 (max 100) for those with 'advanced' training
UPDATE EmployeeEvaluation
SET Score = LEAST(Score + 5, 100)
WHERE EmployeeID IN (
    SELECT EmployeeID
    FROM EmployeeTraining
    WHERE TrainingName ILIKE '%advanced%'
);

-- 3. Change position to 'Pending Training' for employees with no training
UPDATE Employee
SET Position = 'Pending Training'
WHERE NOT EXISTS (
    SELECT 1
    FROM EmployeeTraining t
    WHERE t.EmployeeID = Employee.EmployeeID
);

-- ==========================
-- DELETE Queries
-- ==========================

-- 1. Delete evaluations below 40
DELETE FROM EmployeeEvaluation
WHERE Score < 40;

-- 2. Delete trainings that were never completed
DELETE FROM EmployeeTraining
WHERE CompletionDate IS NULL OR CompletionDate < TrainingDate;

-- 3. Delete shifts that are in the future (test data)
DELETE FROM ShiftSchedule
WHERE ShiftDate > CURRENT_DATE + INTERVAL '30 days';
