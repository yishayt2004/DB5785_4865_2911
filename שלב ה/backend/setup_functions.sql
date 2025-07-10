-- Setup script to ensure all functions and procedures from stage 4 are installed

-- First, ensure the view exists (from stage 3)
CREATE OR REPLACE VIEW HR_Employee_Evaluation_View AS
SELECT 
    e.employeeid,
    e.firstname,
    e.lastname,
    d.departmentname,
    ev.evaluationdate,
    ev.score,
    ev.evaluationid
FROM employee e
JOIN department d ON e.departmentid = d.departmentid
JOIN employeeevaluation ev ON ev.employeeid = e.employeeid
WHERE ev.evaluationdate = (
    SELECT MAX(sub_ev.evaluationdate)
    FROM employeeevaluation sub_ev
    WHERE sub_ev.employeeid = e.employeeid
);

-- Function 1: GetUntrainedEmployees
DROP FUNCTION IF EXISTS GetUntrainedEmployees();
CREATE OR REPLACE FUNCTION GetUntrainedEmployees()
RETURNS TABLE (
    employeeid INT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    position VARCHAR(100),
    departmentname VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT e.employeeid, e.firstname, e.lastname, e.position, d.departmentname
    FROM employee e
    LEFT JOIN department d ON e.departmentid = d.departmentid
    WHERE e.employeeid NOT IN (
        SELECT DISTINCT employeeid
        FROM employeetraining
        WHERE employeeid IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Function 2: GetEmployeeAvgScore
DROP FUNCTION IF EXISTS GetEmployeeAvgScore(INT);
CREATE OR REPLACE FUNCTION GetEmployeeAvgScore(emp_id INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_score NUMERIC;
BEGIN
    SELECT AVG(score)
    INTO avg_score
    FROM employeeevaluation
    WHERE employeeid = emp_id;
    
    RETURN avg_score;
END;
$$ LANGUAGE plpgsql;

-- Procedure 1: RaiseHighPerformerSalaries
DROP PROCEDURE IF EXISTS RaiseHighPerformerSalaries();
CREATE OR REPLACE PROCEDURE RaiseHighPerformerSalaries()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employee
    SET salary = salary * 1.10
    WHERE employeeid IN (
        SELECT DISTINCT e.employeeid
        FROM employee e
        JOIN employeeevaluation ev ON e.employeeid = ev.employeeid
        WHERE ev.score >= 90
    );
END;
$$;

-- Procedure 2: ReduceSalaryForLowScores
DROP PROCEDURE IF EXISTS ReduceSalaryForLowScores();
CREATE OR REPLACE PROCEDURE ReduceSalaryForLowScores()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employee
    SET salary = salary * 0.95
    WHERE employeeid IN (
        SELECT DISTINCT e.employeeid
        FROM employee e
        JOIN employeeevaluation ev ON e.employeeid = ev.employeeid
        WHERE ev.score < 60
    );
END;
$$;

-- Test queries to verify functions work
SELECT 'Testing HR_Employee_Evaluation_View:' as test;
SELECT COUNT(*) as total_evaluations FROM HR_Employee_Evaluation_View;

SELECT 'Testing evaluations by department query:' as test;
SELECT departmentname, COUNT(*) AS num_evaluations
FROM HR_Employee_Evaluation_View
GROUP BY departmentname
ORDER BY num_evaluations DESC;

SELECT 'Testing GetEmployeeAvgScore function:' as test;
SELECT GetEmployeeAvgScore(201) as avg_score_for_employee_201;

SELECT 'Testing GetUntrainedEmployees function:' as test;
SELECT * FROM GetUntrainedEmployees() LIMIT 5;

SELECT 'Setup completed successfully!' as status;
