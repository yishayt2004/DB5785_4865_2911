-- ===========================
-- VIEW 1: HR Department Perspective
-- Shows employee name, department, and their most recent evaluation score
-- ===========================
CREATE OR REPLACE VIEW HR_Employee_Evaluation_View AS
SELECT 
    e.employeeid,
    e.firstname,
    e.lastname,
    d.departmentname,
    ev.evaluationdate,
    ev.score
FROM employee e
JOIN department d ON e.departmentid = d.departmentid
JOIN employeeevaluation ev ON ev.employeeid = e.employeeid
WHERE ev.evaluationdate = (
    SELECT MAX(sub_ev.evaluationdate)
    FROM employeeevaluation sub_ev
    WHERE sub_ev.employeeid = e.employeeid
);

-- Example query 1 on view 1: List top performers
SELECT * FROM HR_Employee_Evaluation_View
WHERE score >= 90;

-- Example query 2 on view 1: List evaluations by department
SELECT departmentname, COUNT(*) AS num_evaluations
FROM HR_Employee_Evaluation_View
GROUP BY departmentname;

-- ===========================
-- VIEW 2: Events Perspective
-- Combines event and employee info for organizing employee
-- ===========================
CREATE OR REPLACE VIEW Event_Organizers_View AS
SELECT 
    ev.eventid,
    ev.event_name,
    ev.eventdate,
    ev.location,
    e.employeeid,
    e.firstname,
    e.lastname,
    d.departmentname
FROM event ev
JOIN employee e ON ev.organizeremployeeid = e.employeeid
JOIN department d ON e.departmentid = d.departmentid;

-- Example query 1 on view 2: Events by department
SELECT departmentname, COUNT(*) AS num_events
FROM Event_Organizers_View
GROUP BY departmentname;

-- Example query 2 on view 2: Upcoming events in next 30 days
SELECT * FROM Event_Organizers_View
WHERE eventdate BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';