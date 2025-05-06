
-- 1. הוספת אילוץ NOT NULL על עמודת Position בטבלת Employee
ALTER TABLE Employee
ALTER COLUMN Position SET NOT NULL;

-- 2. הוספת אילוץ CHECK על עמודת Deductions בטבלת Payroll (מותר רק בין 0 ל־5000)
ALTER TABLE Payroll
ADD CONSTRAINT chk_deductions CHECK (Deductions >= 0 AND Deductions <= 5000);

-- 3. הוספת ערך ברירת מחדל (DEFAULT) לתיאור מחלקה חדשה בטבלת Department
ALTER TABLE Department
ALTER COLUMN Description SET DEFAULT 'No description provided';
