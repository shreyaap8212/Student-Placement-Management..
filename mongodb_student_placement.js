// STUDENT PLACEMENT MANAGEMENT SYSTEM - MongoDB
// Run these commands in mongosh or MongoDB Compass Playground.
// Database: student_placement_nosql

use("student_placement_nosql");

// Create collections
db.createCollection("students");
db.createCollection("companies");
db.createCollection("applications");

// STUDENT DOCUMENTS
db.students.insertMany([
  {
    student_id: 101,
    student_name: "Ananya Rao",
    department: "CSE",
    graduation_year: 2029,
    cgpa: 9.20,
    skills: [
      { name: "Python", proficiency: "Advanced" },
      { name: "SQL", proficiency: "Advanced" },
      { name: "MongoDB", proficiency: "Intermediate" }
    ],
    placement_status: "Placed"
  },
  {
    student_id: 102,
    student_name: "Rahul Kumar",
    department: "ISE",
    graduation_year: 2029,
    cgpa: 8.10,
    skills: [
      { name: "Java", proficiency: "Intermediate" },
      { name: "SQL", proficiency: "Advanced" }
    ],
    placement_status: "Not Placed"
  },
  {
    student_id: 103,
    student_name: "Meera Nair",
    department: "ECE",
    graduation_year: 2029,
    cgpa: 7.40,
    skills: [
      { name: "Python", proficiency: "Intermediate" },
      { name: "Data Analysis", proficiency: "Beginner" }
    ],
    placement_status: "Not Placed"
  },
  {
    student_id: 104,
    student_name: "Arjun Shetty",
    department: "CSE",
    graduation_year: 2029,
    cgpa: 8.80,
    skills: [
      { name: "Java", proficiency: "Advanced" },
      { name: "C", proficiency: "Advanced" }
    ],
    placement_status: "Not Placed"
  }
]);

// COMPANY DOCUMENTS
db.companies.insertMany([
  { company_id: 1, company_name: "TCS", industry: "IT Services" },
  { company_id: 2, company_name: "Infosys", industry: "IT Services" },
  { company_id: 3, company_name: "Accenture", industry: "Consulting and IT" },
  { company_id: 4, company_name: "Microsoft", industry: "Technology" },
  { company_id: 7, company_name: "Amazon", industry: "E-commerce and Technology" }
]);

// APPLICATION DOCUMENTS
db.applications.insertMany([
  {
    application_id: 1,
    student_id: 101,
    student_name: "Ananya Rao",
    company_name: "TCS",
    job_role: "Graduate Trainee",
    application_date: new Date("2026-11-08"),
    status: "Selected",
    package_lpa: 3.5
  },
  {
    application_id: 2,
    student_id: 102,
    student_name: "Rahul Kumar",
    company_name: "Infosys",
    job_role: "Systems Engineer",
    application_date: new Date("2026-11-08"),
    status: "Applied",
    package_lpa: 4.0
  },
  {
    application_id: 3,
    student_id: 103,
    student_name: "Meera Nair",
    company_name: "IBM",
    job_role: "Data Science Intern",
    application_date: new Date("2026-11-08"),
    status: "Applied",
    stipend_monthly: 20000
  }
]);

// CREATE INDEXES
db.students.createIndex({ student_id: 1 }, { unique: true });
db.companies.createIndex({ company_id: 1 }, { unique: true });
db.applications.createIndex({ application_id: 1 }, { unique: true });
db.applications.createIndex({ student_id: 1 });

// MONGODB CRUD AND QUERY EXAMPLES

// 1. Display all students.
db.students.find();

// 2. Find students with CGPA greater than 8.
db.students.find({ cgpa: { $gt: 8 } });

// 3. Find students from CSE department.
db.students.find({ department: "CSE" });

// 4. Find students who know SQL.
db.students.find({ "skills.name": "SQL" });

// 5. Insert one new student.
db.students.insertOne({
  student_id: 105,
  student_name: "Pooja Das",
  department: "AIML",
  graduation_year: 2029,
  cgpa: 6.90,
  skills: [{ name: "Python", proficiency: "Beginner" }],
  placement_status: "Not Placed"
});

// 6. Update a student's placement status.
db.students.updateOne(
  { student_id: 102 },
  { $set: { placement_status: "Placed" } }
);

// 7. Add a skill to a student.
db.students.updateOne(
  { student_id: 102 },
  { $push: { skills: { name: "MongoDB", proficiency: "Beginner" } } }
);

// 8. Count students in each department.
db.students.aggregate([
  { $group: { _id: "$department", total_students: { $sum: 1 } } },
  { $sort: { total_students: -1 } }
]);

// 9. Find average CGPA by department.
db.students.aggregate([
  {
    $group: {
      _id: "$department",
      average_cgpa: { $avg: "$cgpa" }
    }
  }
]);

// 10. Count applications by status.
db.applications.aggregate([
  { $group: { _id: "$status", total: { $sum: 1 } } }
]);

// 11. Display applications with package greater than 4 LPA.
db.applications.find({ package_lpa: { $gt: 4 } });

// 12. Delete the sample student 105 (run only if you want to demonstrate delete).
// db.students.deleteOne({ student_id: 105 });

// OPTIONAL ATLAS DATABASE TRIGGER
// In MongoDB Atlas, create a Database Trigger on the applications collection.
// Operation: Update; Full Document: Update Lookup.
// Example Function body:
//
// exports = async function(changeEvent) {
//   const updated = changeEvent.fullDocument;
//   if (updated && updated.status === "Selected") {
//     const students = context.services
//       .get("mongodb-atlas")
//       .db("student_placement_nosql")
//       .collection("students");
//     await students.updateOne(
//       { student_id: updated.student_id },
//       { $set: { placement_status: "Placed" } }
//     );
//   }
// };
