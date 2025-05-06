
-- ==========================
-- דוגמה ל-ROLLBACK
-- ==========================

-- בדיקת מצב לפני העדכון
SELECT EmployeeID, Salary FROM Employee WHERE Salary < 10000 LIMIT 5;

-- התחלת טרנזקציה
BEGIN;

-- העלאת שכר זמנית לעובדים עם שכר נמוך מ-10000
UPDATE Employee
SET Salary = Salary + 500
WHERE Salary < 10000;

-- בדיקת המצב לאחר העדכון אך לפני השמירה
SELECT EmployeeID, Salary FROM Employee WHERE Salary < 10500 LIMIT 5;

-- ביטול השינויים
ROLLBACK;

-- בדיקת המצב לאחר הביטול
SELECT EmployeeID, Salary FROM Employee WHERE Salary < 10500 LIMIT 5;

-- ==========================
-- דוגמה ל-COMMIT
-- ==========================

-- בדיקת מצב לפני השינוי
SELECT COUNT(*) FROM EmployeeEvaluation WHERE Score BETWEEN 70 AND 80;

-- התחלת טרנזקציה
BEGIN;

-- שינוי ציון לעובדים בציונים בינוניים
UPDATE EmployeeEvaluation
SET Score = Score + 10
WHERE Score BETWEEN 70 AND 80;

-- בדיקת המצב לפני שמירה
SELECT COUNT(*) FROM EmployeeEvaluation WHERE Score > 80;

-- שמירת השינויים
COMMIT;

-- בדיקת המצב לאחר השמירה
SELECT COUNT(*) FROM EmployeeEvaluation WHERE Score > 80;
