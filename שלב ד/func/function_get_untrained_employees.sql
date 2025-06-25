DROP FUNCTION IF EXISTS GetUntrainedEmployees();

CREATE OR REPLACE FUNCTION GetUntrainedEmployees()
RETURNS TABLE(EmployeeID INT, FirstName VARCHAR(50), LastName VARCHAR(50))
AS $$
BEGIN
    RETURN QUERY
    SELECT e.EmployeeID, e.FirstName, e.LastName
    FROM Employee e
    WHERE NOT EXISTS (
        SELECT 1 FROM EmployeeTraining t WHERE t.EmployeeID = e.EmployeeID
    );
END;
$$ LANGUAGE plpgsql;

SELECT * FROM GetUntrainedEmployees();
