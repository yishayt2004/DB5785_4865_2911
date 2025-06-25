
# דוח פרויקט – שלב ד: תכנות (PL/pgSQL)

בשלב זה נכתבו מספר תוכניות על בסיס הנתונים לאחר האינטגרציה. כל תוכנית כוללת תיאור, קוד, ותיעוד הפעלה מוצלח באמצעות צילום מסך או תוצאה מהדאטהבייס.

---

## ✅ פונקציה 1: GetUntrainedEmployees

**תיאור:**  
הפונקציה מחזירה את רשימת כל העובדים שמעולם לא עברו הכשרה. הפלט הוא טבלת תוצאות עם מזהה, שם פרטי ושם משפחה.

**קוד:**
```sql
CREATE OR REPLACE FUNCTION GetUntrainedEmployees()
RETURNS TABLE(EmployeeID INT, FirstName TEXT, LastName TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT e.EmployeeID, e.FirstName, e.LastName
    FROM Employee e
    WHERE NOT EXISTS (
        SELECT 1 FROM EmployeeTraining t WHERE t.EmployeeID = e.EmployeeID
    );
END;
$$ LANGUAGE plpgsql;
```

**הוכחת הפעלה:**  
📸 *צילום מסך של SELECT * FROM GetUntrainedEmployees();*  
הוצגו לפחות 10 תוצאות.

---

## ✅ פונקציה 2: GetEmployeeAvgScore

**תיאור:**  
מקבלת מזהה עובד ומחזירה את ממוצע הציונים שלו מכל ההערכות שקיבל.

**קוד:**
```sql
CREATE OR REPLACE FUNCTION GetEmployeeAvgScore(emp_id INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_score NUMERIC;
BEGIN
    SELECT AVG(Score)
    INTO avg_score
    FROM EmployeeEvaluation
    WHERE EmployeeID = emp_id;

    RETURN avg_score;
END;
$$ LANGUAGE plpgsql;
```

**הוכחת הפעלה:**  
📸 *צילום מסך של SELECT GetEmployeeAvgScore(201);*  
הפונקציה החזירה את ממוצע הציונים בהצלחה.

---

## ✅ פרוצדורה 1: RaiseHighPerformerSalaries

**תיאור:**  
הפרוצדורה מעלה את השכר ב־10% לעובדים שקיבלו לפחות ציון 90 באחת ההערכות.

**קוד:**
```sql
CREATE OR REPLACE PROCEDURE RaiseHighPerformerSalaries()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Employee
    SET Salary = Salary * 1.10
    WHERE EmployeeID IN (
        SELECT DISTINCT EmployeeID
        FROM EmployeeEvaluation
        WHERE Score >= 90
    );
END;
$$;
```

**הוכחת הפעלה:**  
📸 *צילום לפני ואחרי השכר של עובדים עם ציונים גבוהים.*

---

## ✅ פרוצדורה 2: ReduceSalaryForLowScores

**תיאור:**  
פרוצדורה שמפחיתה את השכר ב־15% לעובדים שממוצע ההערכות שלהם נמוך מ־60.

**קוד:**
```sql
CREATE OR REPLACE PROCEDURE ReduceSalaryForLowScores()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Employee
    SET Salary = Salary * 0.85
    WHERE EmployeeID IN (
        SELECT EmployeeID
        FROM (
            SELECT EmployeeID, AVG(Score) AS avg_score
            FROM EmployeeEvaluation
            GROUP BY EmployeeID
        ) sub
        WHERE avg_score < 60
    );
END;
$$;
```

**הוכחת הפעלה:**  
📸 *צילום מסך שמראה ירידה בשכר עבור עובדים רלוונטיים.*

---

## ✅ טריגר 1: הודעה בעת הכנסה לטבלת Event

**תיאור:**  
טריגר המדפיס הודעה לקונסול בעת הוספת אירוע חדש.

**קוד:**
```sql
CREATE OR REPLACE FUNCTION NotifyNewEvent()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'New event "%", organized by Employee ID: %', NEW.EventType, NEW.OrganizerEmployeeID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Trigger_NotifyNewEvent
AFTER INSERT ON Event
FOR EACH ROW
EXECUTE FUNCTION NotifyNewEvent();
```

**הוכחת הפעלה:**  
📸 *צילום מסך של הודעת ה־RAISE NOTICE בהוספת אירוע חדש.*

---

## ✅ טריגר 2: אזהרה על מחיקת עובד מצטיין

**תיאור:**  
טריגר שמציג הודעה לפני מחיקת עובד בעל ציון ממוצע מעל 85.

**קוד:**
```sql
CREATE OR REPLACE FUNCTION WarnBeforeDeletingTopEmployee()
RETURNS TRIGGER AS $$
DECLARE
    avg_score NUMERIC;
BEGIN
    SELECT AVG(Score)
    INTO avg_score
    FROM EmployeeEvaluation
    WHERE EmployeeID = OLD.EmployeeID;

    IF avg_score > 85 THEN
        RAISE NOTICE 'Warning: You are deleting a high-performing employee (ID: %)', OLD.EmployeeID;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Trigger_WarnBeforeDelete
BEFORE DELETE ON Employee
FOR EACH ROW
EXECUTE FUNCTION WarnBeforeDeletingTopEmployee();
```

**הוכחת הפעלה:**  
📸 *צילום מסך של ניסיון למחוק עובד עם ציון גבוה והודעת RAISE NOTICE.*

---

## ✅ תוכנית ראשית 1

**תיאור:**  
מריצה את הפונקציה `GetUntrainedEmployees` ומבצעת העלאת שכר למצטיינים.

**קוד:**  
`main_program_1.sql`

📸 *צילום מסך של ההדפסות ושל השינוי במשכורות.*

---

## ✅ תוכנית ראשית 2

**תיאור:**  
מריצה את `GetEmployeeAvgScore` לעובד אחד, ומבצעת הפחתת שכר לעובדים בעלי ציונים נמוכים.

**קוד:**  
`main_program_2.sql`

📸 *צילום מסך של הדפסה וירידת שכר.*
