DROP FUNCTION IF EXISTS GetEmployeeAvgScore(INT);

CREATE OR REPLACE FUNCTION GetEmployeeAvgScore(emp_id INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_score NUMERIC;
    
BEGIN
    SELECT AVG(Score)
    INTO avg_score
    FROM EmployeeEvaluation
    WHERE EmployeeID = emp_id;
    RETURN avg_score;
END;

$$ LANGUAGE plpgsql;


-- test the function
SELECT GetEmployeeAvgScore(201);
