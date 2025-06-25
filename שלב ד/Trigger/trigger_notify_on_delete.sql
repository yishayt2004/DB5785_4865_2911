CREATE OR REPLACE FUNCTION notify_on_high_score_delete()
RETURNS TRIGGER AS $$
DECLARE
    high_score_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM EmployeeEvaluation
        WHERE EmployeeID = OLD.EmployeeID AND Score > 80
    ) INTO high_score_exists;

    IF high_score_exists THEN
        RAISE NOTICE 'Employee % % is a high performer. Consider keeping them.', OLD.FirstName, OLD.LastName;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_high_score_delete ON Employee;

CREATE TRIGGER trg_notify_high_score_delete
BEFORE DELETE ON Employee
FOR EACH ROW
EXECUTE FUNCTION notify_on_high_score_delete();

-- Test the trigger

INSERT INTO Employee (EmployeeID, FirstName, LastName, BirthDate, Salary, Position, DepartmentID)
VALUES (999, 'Dan', 'Gold', '1990-01-01', 8000, 'Trainer', 2);

INSERT INTO EmployeeEvaluation (EvaluationID, EmployeeID, Score, EvaluationDate)
VALUES (9001, 999, 91, '2025-05-01');

DELETE FROM Employee WHERE EmployeeID = 999;

