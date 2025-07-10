
# דוח פרויקט – שלב ה': אפליקציית ווב למערכת ניהול משאבי אנוש

בשלב זה פותחה אפליקציית ווב מלאה למערכת ניהול משאבי אנוש עם frontend ו-backend המתחברים למסד הנתונים PostgreSQL.

## 🚀 הוראות הפעלה של האפליקציה

### דרישות מוקדמות
- Node.js (גרסה 14 ומעלה)
- npm או yarn
- PostgreSQL מותקן ופועל
- מסד הנתונים מהשלבים הקודמים

### הפעלת הסרבר (Backend)

1. נווט לתיקיית הסרבר:
```bash
cd "שלב ה/backend"
```

2. התקן dependencies:
```bash
npm install
```

3. צור קובץ `.env` עם פרטי החיבור למסד הנתונים:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3001
```

4. הפעל את הסרבר:
```bash
npm start
```

הסרבר יעלה על http://localhost:3001

### הפעלת הממשק (Frontend)

1. פתח terminal נוסף ונווט לתיקיית הממשק:
```bash
cd "שלב ה/frontend"
```

2. התקן dependencies:
```bash
npm install
```

3. הפעל את האפליקציה:
```bash
npm start
```

הממשק יפתח אוטומטית בדפדפן על http://localhost:3000

## 🛠 דרך העבודה והכלים שבהם השתמשנו

### טכנולוגיות Backend
- **Node.js** - סביבת הפעלה לשרת
- **Express.js** - פריימוורק לבניית RESTful API
- **pg (node-postgres)** - דרייבר להתחברות ל-PostgreSQL
- **CORS** - לאפשר קריאות מה-frontend
- **dotenv** - לניהול משתני סביבה
- **body-parser** - לעיבוד נתונים מה-client

### טכנולוגיות Frontend
- **React.js** - ספריית JavaScript לבניית ממשק משתמש
- **React Router** - לניהול ניווט בין דפים
- **Bootstrap & React-Bootstrap** - לעיצוב ו-UI components
- **Axios** - לביצוע HTTP requests לסרבר
- **FontAwesome** - לאיקונים

### מבנה האפליקציה

#### Backend Structure
```
backend/
├── server.js (שרת ראשי)
├── routes/
│   ├── employees.js (ניהול עובדים)
│   ├── departments.js (ניהול מחלקות)
│   ├── evaluations.js (ניהול הערכות)
│   ├── trainings.js (ניהול הכשרות)
│   └── reports.js (דוחות וסטטיסטיקות)
├── setup_functions.sql (פונקציות עזר)
└── package.json
```

#### Frontend Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js (רכיב ראשי)
│   ├── index.js (נקודת כניסה)
│   ├── index.css (עיצוב כללי)
│   ├── components/
│   │   └── Navigation.js (תפריט ניווט)
│   └── pages/
│       ├── Home.js (עמוד בית)
│       ├── Employees.js (ניהול עובדים)
│       ├── Departments.js (ניהול מחלקות)
│       ├── Evaluations.js (ניהול הערכות)
│       ├── Trainings.js (ניהול הכשרות)
│       └── Reports.js (דוחות)
└── package.json
```

### תכונות האפליקציה
1. **ניהול עובדים** - הוספה, עדכון, מחיקה והצגת עובדים
2. **ניהול מחלקות** - ניהול המחלקות הארגוניות
3. **ניהול הערכות** - רישום והצגת הערכות ביצועים
4. **ניהול הכשרות** - רישום השתתפות בהכשרות
5. **דוחות וסטטיסטיקות** - הצגת נתונים מתקדמים ואנליטיקה

## 📸 תמונות מסך של הפעלת האפליקציה

### עמוד הבית
![עמוד הבית של המערכת](שלב ה/screenshots/home_page.png)

### ניהול עובדים
![רשימת עובדים](שלב ה/screenshots/employees_list.png)
![הוספת עובד חדש](שלב ה/screenshots/add_employee.png)

### ניהול מחלקות
![ניהול מחלקות](שלב ה/screenshots/departments.png)

### מערכת הערכות
![רשימת הערכות](שלב ה/screenshots/evaluations.png)
![הוספת הערכה](שלב ה/screenshots/add_evaluation.png)

### ניהול הכשרות
![ניהול הכשרות](שלב ה/screenshots/trainings.png)

### דוחות וסטטיסטיקות
![דוח ביצועים](שלב ה/screenshots/reports.png)
![גרפים וסטטיסטיקות](שלב ה/screenshots/statistics.png)

---

## ✨ תכונות מתקדמות

- **Responsive Design** - האפליקציה מותאמת לכל המכשירים
- **Real-time Updates** - עדכונים בזמן אמת ללא צורך ברענון דף
- **Error Handling** - טיפול מתקדם בשגיאות והודעות למשתמש
- **Data Validation** - ולידציה של נתונים בצד הלקוח והשרת
- **REST API** - ממשק תכנות מובנה וסטנדרטי

---



