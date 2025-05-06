-- INSERTS for Department
INSERT INTO Department (DepartmentID, DepartmentName, Description, EstablishedDate)
VALUES (1, 'Human Resources', 'Handles recruitment, training and employee relations', '2005-03-15');

INSERT INTO Department (DepartmentID, DepartmentName, Description, EstablishedDate)
VALUES (2, 'Finance', 'Manages budgeting and financial operations', '2006-07-01');

INSERT INTO Department (DepartmentID, DepartmentName, Description, EstablishedDate)
VALUES (3, 'IT', 'Oversees technology and systems', '2008-01-10');


-- INSERTS for Employee
INSERT INTO Employee (EmployeeID, FirstName, LastName, BirthDate, Salary, Position, ContactInfo, DepartmentID)
VALUES (1, 'David', 'Levi', '1985-04-23', 5000.00, 'HR Manager', 'david.levi@example.com', 1);

INSERT INTO Employee (EmployeeID, FirstName, LastName, BirthDate, Salary, Position, ContactInfo, DepartmentID)
VALUES (2, 'Sara', 'Cohen', '1990-06-10', 4000.00, 'Recruiter', 'sara.cohen@example.com', 1);

INSERT INTO Employee (EmployeeID, FirstName, LastName, BirthDate, Salary, Position, ContactInfo, DepartmentID)
VALUES (3, 'Moshe', 'Rosen', '1988-12-05', 6000.00, 'IT Specialist', 'moshe.rosen@example.com', 3);


-- INSERTS for Payroll
INSERT INTO Payroll (PayrollID, EmployeeID, SalaryPaid, PaymentDate, Deductions, PaymentPeriodStart, PaymentPeriodEnd)
VALUES (1, 1, 5000.00, '2022-07-31', 200.00, '2022-07-01', '2022-07-31');

INSERT INTO Payroll (PayrollID, EmployeeID, SalaryPaid, PaymentDate, Deductions, PaymentPeriodStart, PaymentPeriodEnd)
VALUES (2, 2, 4000.00, '2022-07-31', 150.00, '2022-07-01', '2022-07-31');

INSERT INTO Payroll (PayrollID, EmployeeID, SalaryPaid, PaymentDate, Deductions, PaymentPeriodStart, PaymentPeriodEnd)
VALUES (3, 3, 6000.00, '2022-07-31', 250.00, '2022-07-01', '2022-07-31');


-- INSERTS for EmployeeEvaluation
INSERT INTO EmployeeEvaluation (EvaluationID, EmployeeID, EvaluationDate, Score, Comments, NextReviewDate)
VALUES (1, 1, '2022-06-30', 85, 'Good performance overall', '2023-06-30');

INSERT INTO EmployeeEvaluation (EvaluationID, EmployeeID, EvaluationDate, Score, Comments, NextReviewDate)
VALUES (2, 2, '2022-06-30', 90, 'Excellent performance', '2023-06-30');

INSERT INTO EmployeeEvaluation (EvaluationID, EmployeeID, EvaluationDate, Score, Comments, NextReviewDate)
VALUES (3, 3, '2022-06-30', 80, 'Satisfactory performance', '2023-06-30');


-- INSERTS for ShiftSchedule
INSERT INTO ShiftSchedule (ShiftID, EmployeeID, ShiftDate, StartTime, EndTime)
VALUES (1, 1, '2022-08-01', '08:00:00', '16:00:00');

INSERT INTO ShiftSchedule (ShiftID, EmployeeID, ShiftDate, StartTime, EndTime)
VALUES (2, 2, '2022-08-01', '09:00:00', '17:00:00');

INSERT INTO ShiftSchedule (ShiftID, EmployeeID, ShiftDate, StartTime, EndTime)
VALUES (3, 3, '2022-08-01', '07:00:00', '15:00:00');


-- INSERTS for EmployeeTraining
INSERT INTO EmployeeTraining (TrainingID, EmployeeID, TrainingName, TrainingDate, CompletionDate, Trainer)
VALUES (1, 1, 'Leadership Training', '2022-05-10', '2022-05-15', 'John Doe');

INSERT INTO EmployeeTraining (TrainingID, EmployeeID, TrainingName, TrainingDate, CompletionDate, Trainer)
VALUES (2, 2, 'Recruitment Strategies', '2022-06-01', '2022-06-05', 'Jane Smith');

INSERT INTO EmployeeTraining (TrainingID, EmployeeID, TrainingName, TrainingDate, CompletionDate, Trainer)
VALUES (3, 3, 'Technical Skills Upgrade', '2022-04-20', '2022-04-25', 'Alice Brown');
