-- STUDENT PLACEMENT MANAGEMENT SYSTEM
-- Database: MySQL 8.0+
-- Run this complete script in MySQL Workbench.

DROP DATABASE IF EXISTS student_placement_db;
CREATE DATABASE student_placement_db;
USE student_placement_db;

-- 1. STUDENT
CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    department VARCHAR(60) NOT NULL,
    graduation_year INT NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    placement_status VARCHAR(20) NOT NULL DEFAULT 'Not Placed',
    CONSTRAINT chk_student_cgpa CHECK (cgpa BETWEEN 0 AND 10),
    CONSTRAINT chk_graduation_year CHECK (graduation_year >= 2020),
    CONSTRAINT chk_student_status CHECK
        (placement_status IN ('Not Placed', 'Placed'))
);

-- 2. COMPANY
CREATE TABLE Company (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(150) UNIQUE,
    industry VARCHAR(80) NOT NULL
);

-- 3. PLACEMENT DRIVE
CREATE TABLE Placement_Drive (
    drive_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    drive_name VARCHAR(120) NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    min_cgpa DECIMAL(3,2) NOT NULL DEFAULT 0,
    package_lpa DECIMAL(8,2) NOT NULL,
    drive_date DATE NOT NULL,
    CONSTRAINT fk_drive_company FOREIGN KEY (company_id)
        REFERENCES Company(company_id),
    CONSTRAINT chk_drive_cgpa CHECK (min_cgpa BETWEEN 0 AND 10),
    CONSTRAINT chk_drive_package CHECK (package_lpa > 0)
);

-- 4. INTERNSHIP
CREATE TABLE Internship (
    internship_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    internship_role VARCHAR(100) NOT NULL,
    min_cgpa DECIMAL(3,2) NOT NULL DEFAULT 0,
    stipend_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    CONSTRAINT fk_internship_company FOREIGN KEY (company_id)
        REFERENCES Company(company_id),
    CONSTRAINT chk_internship_cgpa CHECK (min_cgpa BETWEEN 0 AND 10),
    CONSTRAINT chk_stipend CHECK (stipend_monthly >= 0)
);

-- 5. SKILL
CREATE TABLE Skill (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(60) NOT NULL UNIQUE
);

-- 6. STUDENT-SKILL (many-to-many relationship)
CREATE TABLE Student_Skill (
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency VARCHAR(20) NOT NULL DEFAULT 'Beginner',
    PRIMARY KEY (student_id, skill_id),
    CONSTRAINT fk_ss_student FOREIGN KEY (student_id)
        REFERENCES Student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id)
        REFERENCES Skill(skill_id),
    CONSTRAINT chk_proficiency CHECK
        (proficiency IN ('Beginner', 'Intermediate', 'Advanced'))
);

-- 7. APPLICATION
-- Exactly one of drive_id or internship_id must be provided.
CREATE TABLE Application (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    drive_id INT NULL,
    internship_id INT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Applied',
    CONSTRAINT fk_application_student FOREIGN KEY (student_id)
        REFERENCES Student(student_id),
    CONSTRAINT fk_application_drive FOREIGN KEY (drive_id)
        REFERENCES Placement_Drive(drive_id),
    CONSTRAINT fk_application_internship FOREIGN KEY (internship_id)
        REFERENCES Internship(internship_id),
    CONSTRAINT chk_application_target CHECK
        ((drive_id IS NOT NULL AND internship_id IS NULL)
         OR (drive_id IS NULL AND internship_id IS NOT NULL)),
    CONSTRAINT chk_application_status CHECK
        (status IN ('Applied', 'Shortlisted', 'Selected', 'Rejected'))
);

-- Prevent duplicate applications to the same drive or internship.
CREATE UNIQUE INDEX uq_student_drive
    ON Application(student_id, drive_id);
CREATE UNIQUE INDEX uq_student_internship
    ON Application(student_id, internship_id);

-- 8. PLACEMENT
CREATE TABLE Placement (
    placement_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE,
    student_id INT NOT NULL,
    company_id INT NOT NULL,
    drive_id INT NULL,
    internship_id INT NULL,
    package_lpa DECIMAL(8,2) NULL,
    offer_date DATE NOT NULL,
    CONSTRAINT fk_placement_application FOREIGN KEY (application_id)
        REFERENCES Application(application_id),
    CONSTRAINT fk_placement_student FOREIGN KEY (student_id)
        REFERENCES Student(student_id),
    CONSTRAINT fk_placement_company FOREIGN KEY (company_id)
        REFERENCES Company(company_id),
    CONSTRAINT fk_placement_drive FOREIGN KEY (drive_id)
        REFERENCES Placement_Drive(drive_id),
    CONSTRAINT fk_placement_internship FOREIGN KEY (internship_id)
        REFERENCES Internship(internship_id),
    CONSTRAINT chk_placement_target CHECK
        ((drive_id IS NOT NULL AND internship_id IS NULL)
         OR (drive_id IS NULL AND internship_id IS NOT NULL)),
    CONSTRAINT chk_placement_package CHECK
        (package_lpa IS NULL OR package_lpa > 0)
);

-- 9. APPLICATION AUDIT
CREATE TABLE Application_Audit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_application FOREIGN KEY (application_id)
        REFERENCES Application(application_id)
);

-- SAMPLE DATA
INSERT INTO Student
(student_id, student_name, email, phone, department, graduation_year, cgpa)
VALUES
(101, 'Ananya Rao', 'ananya@example.com', '9876543210', 'CSE', 2029, 9.20),
(102, 'Rahul Kumar', 'rahul@example.com', '9876543211', 'ISE', 2029, 8.10),
(103, 'Meera Nair', 'meera@example.com', '9876543212', 'ECE', 2029, 7.40),
(104, 'Arjun Shetty', 'arjun@example.com', '9876543213', 'CSE', 2029, 8.80),
(105, 'Pooja Das', 'pooja@example.com', '9876543214', 'AIML', 2029, 6.90);

INSERT INTO Company (company_name, website, industry) VALUES
('TCS', 'https://www.tcs.com', 'IT Services'),
('Infosys', 'https://www.infosys.com', 'IT Services'),
('Accenture', 'https://www.accenture.com', 'Consulting and IT'),
('Microsoft', 'https://www.microsoft.com', 'Technology'),
('Deloitte', 'https://www.deloitte.com', 'Consulting'),
('Wipro', 'https://www.wipro.com', 'IT Services'),
('Amazon', 'https://www.amazon.com', 'E-commerce and Technology'),
('IBM', 'https://www.ibm.com', 'Technology');

INSERT INTO Placement_Drive
(company_id, drive_name, job_role, min_cgpa, package_lpa, drive_date)
VALUES
(1, 'TCS Ninja 2026', 'Graduate Trainee', 7.00, 3.50, '2026-11-15'),
(2, 'Infosys Systems Engineer', 'Systems Engineer', 7.50, 4.00, '2026-11-18'),
(3, 'Accenture ASE', 'Associate Software Engineer', 7.00, 4.50, '2026-11-20'),
(4, 'Microsoft SDE', 'Software Engineer', 8.50, 18.00, '2026-11-25'),
(5, 'Deloitte Analyst', 'Analyst', 7.00, 6.00, '2026-11-28');

INSERT INTO Internship
(company_id, internship_role, min_cgpa, stipend_monthly, start_date)
VALUES
(7, 'Software Development Intern', 8.00, 30000, '2027-01-10'),
(8, 'Data Science Intern', 7.00, 20000, '2027-01-15'),
(2, 'Cloud Intern', 7.50, 18000, '2027-02-01');

INSERT INTO Skill (skill_name) VALUES
('Python'), ('Java'), ('SQL'), ('MongoDB'), ('Data Analysis'), ('C');

INSERT INTO Student_Skill (student_id, skill_id, proficiency) VALUES
(101, 1, 'Advanced'), (101, 3, 'Advanced'), (101, 4, 'Intermediate'),
(102, 2, 'Intermediate'), (102, 3, 'Advanced'),
(103, 1, 'Intermediate'), (103, 5, 'Beginner'),
(104, 2, 'Advanced'), (104, 6, 'Advanced'),
(105, 1, 'Beginner'), (105, 3, 'Intermediate');

-- TRIGGERS
DELIMITER $$

-- Trigger 1: Check CGPA before accepting an application.
CREATE TRIGGER check_eligibility
BEFORE INSERT ON Application
FOR EACH ROW
BEGIN
    DECLARE v_cgpa DECIMAL(3,2);
    DECLARE v_min_cgpa DECIMAL(3,2);

    SELECT cgpa INTO v_cgpa
    FROM Student
    WHERE student_id = NEW.student_id;

    IF NEW.drive_id IS NOT NULL THEN
        SELECT min_cgpa INTO v_min_cgpa
        FROM Placement_Drive
        WHERE drive_id = NEW.drive_id;
    ELSE
        SELECT min_cgpa INTO v_min_cgpa
        FROM Internship
        WHERE internship_id = NEW.internship_id;
    END IF;

    IF v_cgpa < v_min_cgpa THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student is not eligible due to low CGPA';
    END IF;
END$$

-- Trigger 2: Store every application status change in audit table.
CREATE TRIGGER track_application_status
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO Application_Audit
        (application_id, old_status, new_status)
        VALUES
        (NEW.application_id, OLD.status, NEW.status);
    END IF;
END$$

-- Trigger 3: Automatically create a placement record when selected.
CREATE TRIGGER create_placement
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    DECLARE v_company_id INT;
    DECLARE v_package DECIMAL(8,2);

    IF NEW.status = 'Selected' AND OLD.status <> 'Selected' THEN
        IF NEW.drive_id IS NOT NULL THEN
            SELECT company_id, package_lpa
            INTO v_company_id, v_package
            FROM Placement_Drive
            WHERE drive_id = NEW.drive_id;

            INSERT INTO Placement
            (application_id, student_id, company_id, drive_id,
             internship_id, package_lpa, offer_date)
            VALUES
            (NEW.application_id, NEW.student_id, v_company_id,
             NEW.drive_id, NULL, v_package, CURDATE());
        ELSE
            SELECT company_id INTO v_company_id
            FROM Internship
            WHERE internship_id = NEW.internship_id;

            INSERT INTO Placement
            (application_id, student_id, company_id, drive_id,
             internship_id, package_lpa, offer_date)
            VALUES
            (NEW.application_id, NEW.student_id, v_company_id,
             NULL, NEW.internship_id, NULL, CURDATE());
        END IF;

        UPDATE Student
        SET placement_status = 'Placed'
        WHERE student_id = NEW.student_id;
    END IF;
END$$

DELIMITER ;

-- SAMPLE APPLICATIONS
-- Student 101 is eligible for TCS drive (CGPA 9.20 >= 7.00).
INSERT INTO Application
(student_id, drive_id, internship_id, application_date, status)
VALUES
(101, 1, NULL, CURDATE(), 'Applied'),
(102, 2, NULL, CURDATE(), 'Applied'),
(103, NULL, 2, CURDATE(), 'Applied'),
(104, 4, NULL, CURDATE(), 'Applied');

-- Demonstrate triggers: this creates a Placement row and an audit row.
UPDATE Application
SET status = 'Selected'
WHERE application_id = 1;

-- SQL QUERIES

-- Q1. Display all students.
SELECT * FROM Student;

-- Q2. Display students with CGPA greater than 8.
SELECT student_id, student_name, cgpa
FROM Student
WHERE cgpa > 8.00;

-- Q3. Display all companies.
SELECT * FROM Company;

-- Q4. Display placement drives with company names.
SELECT d.drive_id, d.drive_name, c.company_name, d.job_role,
       d.min_cgpa, d.package_lpa
FROM Placement_Drive d
JOIN Company c ON d.company_id = c.company_id;

-- Q5. Display student applications and their statuses.
SELECT a.application_id, s.student_name, a.status, a.application_date
FROM Application a
JOIN Student s ON a.student_id = s.student_id;

-- Q6. Count students in each department.
SELECT department, COUNT(*) AS total_students
FROM Student
GROUP BY department;

-- Q7. Find average CGPA.
SELECT AVG(cgpa) AS average_cgpa
FROM Student;

-- Q8. Find highest package offered in placement drives.
SELECT MAX(package_lpa) AS highest_package
FROM Placement_Drive;

-- Q9. Display students who know SQL.
SELECT s.student_id, s.student_name
FROM Student s
JOIN Student_Skill ss ON s.student_id = ss.student_id
JOIN Skill sk ON ss.skill_id = sk.skill_id
WHERE sk.skill_name = 'SQL';

-- Q10. Count applications for each status.
SELECT status, COUNT(*) AS total_applications
FROM Application
GROUP BY status;

-- Q11. Display selected students and their placement details.
SELECT s.student_name, c.company_name, p.package_lpa, p.offer_date
FROM Placement p
JOIN Student s ON p.student_id = s.student_id
JOIN Company c ON p.company_id = c.company_id;

-- Q12. Find students whose CGPA is above the overall average.
SELECT student_name, cgpa
FROM Student
WHERE cgpa > (SELECT AVG(cgpa) FROM Student);

-- Q13. Display application status change history.
SELECT * FROM Application_Audit
ORDER BY changed_at DESC;

-- Q14. Display drives offering more than 5 LPA, highest first.
SELECT drive_name, job_role, package_lpa
FROM Placement_Drive
WHERE package_lpa > 5
ORDER BY package_lpa DESC;

-- Q15. Display students who have not yet been placed.
SELECT student_id, student_name
FROM Student
WHERE placement_status = 'Not Placed';
