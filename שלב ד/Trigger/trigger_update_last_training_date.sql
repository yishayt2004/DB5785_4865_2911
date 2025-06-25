CREATE OR REPLACE FUNCTION UpdateLastTrainingDate()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Employee
    SET LastTrainingDate = NEW.TrainingDate
    WHERE EmployeeID = NEW.EmployeeID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_UpdateLastTrainingDate
AFTER INSERT ON EmployeeTraining
FOR EACH ROW
EXECUTE FUNCTION UpdateLastTrainingDate();

--test the trigger
SELECT EmployeeID, FirstName, LastName, LastTrainingDate
FROM Employee
WHERE EmployeeID = 201; 

INSERT INTO EmployeeTraining (TrainingID, EmployeeID, TrainingName, TrainingDate)
VALUES (999, 201, 'Leadership Program', '2025-06-25');

SELECT EmployeeID, FirstName, LastName, LastTrainingDate
