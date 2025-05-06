CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR2(100) NOT NULL,
    Description VARCHAR2(255),
    EstablishedDate DATE
);

CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR2(50) NOT NULL,
    LastName VARCHAR2(50) NOT NULL,
    BirthDate DATE,
    Salary NUMERIC(10,2),
    Position VARCHAR2(100),
    ContactInfo VARCHAR2(255), 
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

CREATE TABLE Payroll (
    PayrollID INT PRIMARY KEY,
    EmployeeID INT,
    SalaryPaid NUMERIC(10,2),
    PaymentDate DATE,
    Deductions NUMERIC(10,2),
    PaymentPeriodStart DATE,
    PaymentPeriodEnd DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE EmployeeEvaluation (
    EvaluationID INT PRIMARY KEY,
    EmployeeID INT,
    EvaluationDate DATE,
    Score INT CHECK (Score BETWEEN 1 AND 100),
    Comments VARCHAR2(255),
    NextReviewDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE ShiftSchedule (
    ShiftID INT PRIMARY KEY,
    EmployeeID INT,
    ShiftDate DATE,
    StartTime TIME,
    EndTime TIME,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE EmployeeTraining (
    TrainingID INT PRIMARY KEY,
    EmployeeID INT,
    TrainingName VARCHAR2(100),
    TrainingDate DATE,
    CompletionDate DATE,
    Trainer VARCHAR2(100),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);