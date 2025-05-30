# דוח שלב א – פרויקט בסיס נתונים: מלון - אגף משאבי אנוש

## 🧑‍🤝‍🧑 שמות חברי הצוות:
- איתן לטס
- ישי ירם

## 🗂️ המערכת: ניהול מלון  
**היחידה שבחרנו לעבוד עליה:** משאבי אנוש (Staff & Human Resources Division)

---

## תוכן עניינים
1. [מבוא](#מבוא)
2. [ה-ERD וה-DSD](#ה-erd-וה-dsd)
3. [החלטות עיצוב עיקריות](#החלטות-עיצוב-עיקריות)
4. [שיטות אכלוס הנתונים](#שיטות-אכלוס-הנתונים)
5. [גיבוי ושחזור](#גיבוי-ושחזור)

---

## מבוא

המערכת שלנו אחראית על ניהול נתוני העובדים במלון. המערכת שומרת מידע עבור:
- פרטי עובדים ומחלקותיהם
- משכורות
- משמרות
- הערכות ביצועים
- הדרכות

הפונקציונליות כוללת:
- ניהול משכורות ודוחות שכר
- מעקב אחרי שיבוץ משמרות
- תיעוד הכשרות מקצועיות וביצועי עובדים

---

## ה-ERD וה-DSD

### ERD:
![ERD](screenshots/erd.png)

### DSD (סכמה לוגית):
![DSD](screenshots/dsd.png)

---

## החלטות עיצוב עיקריות

- **נרמול:** כל המודל תוכנן בהתאם ל־3NF כדי למנוע כפילויות ושמירה על עקביות.
- **שדות DATE:** לכל ישות יש לפחות שני תאריכים משמעותיים (למשל: `BirthDate`, `PaymentDate`, `ShiftDate`).
- **קשרים:** רוב הישויות מקושרות ל־Employee, תוך שמירה על יחסים של One-to-Many או Many-to-One לפי הצורך.

---

## שיטות אכלוס הנתונים

בחרנו בשלוש שיטות שונות:

### 1. קבצי CSV (DataImportFiles):
ייבוא דרך קבצי CSV, לדוגמה:
- `Employee.csv`
- `Payroll.csv`

📷 צילומי מסך:
![csv_import](screenshots/csv_import.png)

---

### 2. קוד פייתון (Programing):
יצרנו סקריפט שמייצר 400 פקודות `INSERT` לכל טבלה.

📷 צילומי מסך:
![python_insert](screenshots/python_script.png)

---

### 3. אתר Mockaroo (mockarooFiles):
הגדרנו סכמת נתונים תואמת לטבלאות, ייצאנו 400 רשומות לכל טבלה.

📷 צילומי מסך:
![mockaroo](screenshots/mockaroo.png)

---

## גיבוי ושחזור

ביצענו גיבוי של בסיס הנתונים באמצעות pgAdmin / פקודת `pg_dump`.

- שם קובץ הגיבוי: `backup_2025_05_06.backup`
- קובץ זה נבדק ונשחזר בהצלחה במסד נתונים אחר.

📷 צילומי מסך:
![backup](screenshots/backup.png)
![restore](screenshots/restore.png)

---

## ✔️ סיכום

בשלב זה סיימנו את תכנון הסכמה, הקמת הטבלאות, אכלוס של מעל 400 רשומות לכל טבלה ב־3 שיטות שונות, וכן ביצוע גיבוי מלא.
