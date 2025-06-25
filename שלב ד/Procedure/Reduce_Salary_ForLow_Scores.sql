CREATE OR REPLACE PROCEDURE ReduceSalaryForLowScores()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Employee e
    SET Salary = Salary * 0.95
    WHERE EXISTS (
        SELECT 1
        FROM EmployeeEvaluation ev
        WHERE ev.EmployeeID = e.EmployeeID
          AND ev.Score < 60
          AND ev.EvaluationDate = (
              SELECT MAX(sub.EvaluationDate)
              FROM EmployeeEvaluation sub
              WHERE sub.EmployeeID = ev.EmployeeID
          )
    );

    RAISE NOTICE 'Salaries reduced by 5%% for employees with low recent evaluations.';
END;
$$;

-- Test the procedure
CALL ReduceSalaryForLowScores();
SELECT EmployeeID, FirstName, Salary FROM Employee;