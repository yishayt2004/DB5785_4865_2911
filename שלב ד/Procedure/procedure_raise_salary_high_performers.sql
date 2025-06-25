DROP PROCEDURE IF EXISTS RaiseHighPerformerSalaries;

CREATE OR REPLACE PROCEDURE RaiseHighPerformerSalaries()
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    avg_score NUMERIC;
BEGIN
    FOR rec IN
        SELECT e.EmployeeID, AVG(ev.Score) AS avg_score
        FROM Employee e
        JOIN EmployeeEvaluation ev ON e.EmployeeID = ev.EmployeeID
        GROUP BY e.EmployeeID
    LOOP
        IF rec.avg_score > 85 THEN
            UPDATE Employee
            SET Salary = Salary * 1.05
            WHERE EmployeeID = rec.EmployeeID;
        END IF;
    END LOOP;
END;
$$;

-- test the procedure
CALL RaiseHighPerformerSalaries();
SELECT EmployeeID, FirstName, Salary FROM Employee;
