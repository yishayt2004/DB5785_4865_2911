
BEGIN;
DO $$
DECLARE
    emp_rec RECORD;
BEGIN
    FOR emp_rec IN SELECT * FROM GetUntrainedEmployees() LOOP
        RAISE NOTICE 'Untrained: % % (ID: %)', emp_rec.FirstName, emp_rec.LastName, emp_rec.EmployeeID;
    END LOOP;
END;
$$;

CALL RaiseHighPerformerSalaries();

COMMIT;
