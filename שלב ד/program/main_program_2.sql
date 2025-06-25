BEGIN;

DO $$
DECLARE
    emp_id INT := 201;  
    avg_score NUMERIC;
BEGIN
    avg_score := GetEmployeeAvgScore(emp_id);
    RAISE NOTICE 'Employee % has average score: %', emp_id, avg_score;
END;
$$;

CALL ReduceSalaryForLowScores();

COMMIT;
