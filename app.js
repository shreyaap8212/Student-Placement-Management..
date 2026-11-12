const students = [
 {id:101,name:"Ananya Rao",email:"ananya@example.com",dept:"CSE",cgpa:9.2,year:2029,skills:["Python","SQL","MongoDB"],status:"Placed"},
 {id:102,name:"Rahul Kumar",email:"rahul@example.com",dept:"ISE",cgpa:8.1,year:2029,skills:["Java","SQL"],status:"Not Placed"},
 {id:103,name:"Meera Nair",email:"meera@example.com",dept:"ECE",cgpa:7.4,year:2029,skills:["Python","Data Analysis"],status:"Not Placed"},
 {id:104,name:"Arjun Shetty",email:"arjun@example.com",dept:"CSE",cgpa:8.8,year:2029,skills:["Java","C"],status:"Not Placed"},
 {id:105,name:"Pooja Das",email:"pooja@example.com",dept:"AIML",cgpa:6.9,year:2029,skills:["Python","SQL"],status:"Not Placed"}
];
const companies=[
 {id:1,name:"TCS",industry:"IT Services",initial:"T",color:"",website:"tcs.com"},
 {id:2,name:"Infosys",industry:"IT Services",initial:"I",color:"blue-logo",website:"infosys.com"},
 {id:3,name:"Accenture",industry:"Consulting and IT",initial:"A",color:"orange-logo",website:"accenture.com"},
 {id:4,name:"Microsoft",industry:"Technology",initial:"M",color:"blue-logo",website:"microsoft.com"},
 {id:5,name:"Deloitte",industry:"Consulting",initial:"D",color:"green-logo",website:"deloitte.com"},
 {id:6,name:"Wipro",industry:"IT Services",initial:"W",color:"",website:"wipro.com"},
 {id:7,name:"Amazon",industry:"E-commerce and Technology",initial:"a",color:"orange-logo",website:"amazon.com"},
 {id:8,name:"IBM",industry:"Technology",initial:"IBM",color:"blue-logo",website:"ibm.com"}
];
const drives=[
 {id:1,company:"TCS",role:"Graduate Trainee",name:"TCS Ninja 2026",cgpa:7,package:3.5,date:"2026-11-15",color:""},
 {id:2,company:"Infosys",role:"Systems Engineer",name:"Infosys Systems Engineer",cgpa:7.5,package:4,date:"2026-11-18",color:"blue-logo"},
 {id:3,company:"Accenture",role:"Associate Software Engineer",name:"Accenture ASE",cgpa:7,package:4.5,date:"2026-11-20",color:"orange-logo"},
 {id:4,company:"Microsoft",role:"Software Engineer",name:"Microsoft SDE",cgpa:8.5,package:18,date:"2026-11-25",color:"blue-logo"},
 {id:5,company:"Deloitte",role:"Analyst",name:"Deloitte Analyst",cgpa:7,package:6,date:"2026-11-28",color:""}
];
const internships=[
 {id:1,company:"Amazon",role:"Software Development Intern",cgpa:8,stipend:30000,date:"2027-01-10",color:"orange-logo"},
 {id:2,company:"IBM",role:"Data Science Intern",cgpa:7,stipend:20000,date:"2027-01-15",color:"blue-logo"},
 {id:3,company:"Infosys",role:"Cloud Intern",cgpa:7.5,stipend:18000,date:"2027-02-01",color:"blue-logo"}
];
let applications=[
 {id:1,student:101,company:"TCS",role:"Graduate Trainee",date:"08 Nov 2026",status:"Selected",package:3.5},
 {id:2,student:102,company:"Infosys",role:"Systems Engineer",date:"08 Nov 2026",status:"Applied",package:4},
 {id:3,student:103,company:"IBM",role:"Data Science Intern",date:"08 Nov 2026",status:"Applied",package:null},
 {id:4,student:104,company:"Microsoft",role:"Software Engineer",date:"08 Nov 2026",status:"Applied",package:18}
];
const $=s=>document.querySelector(s);
const initials=name=>name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
const companyInfo=name=>companies.find(c=>c.name===name)||{initial:name[0],color:""};
const dateFmt=d=>new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
function statusPill(status){return `<span class="status ${status.toLowerCase()}">${status}</span>`}
function logo(name,color=""){const c=companyInfo(name);return `<div class="company-logo ${color||c.color}">${c.initial||name[0]}</div>`}
function renderStudents(){
 const q=($("#studentSearch")?.value||"").toLowerCase(),dept=$("#departmentFilter")?.value||"",status=$("#statusFilter")?.value||"";
 const rows=students.filter(s=>(s.name+s.email+s.dept).toLowerCase().includes(q)&&(!dept||s.dept===dept)&&(!status||s.status===status));
 $("#studentCount").textContent=rows.length;
 $("#studentsTable").innerHTML=rows.length?rows.map(s=>`<tr><td><div class="student-cell"><div class="avatar">${initials(s.name)}</div><div><b>${s.name}</b><small>${s.email}</small></div></div></td><td>${s.dept}</td><td><b>${s.cgpa.toFixed(2)}</b></td><td>${s.year}</td><td>${s.skills.map(x=>`<span class="skill-chip">${x}</span>`).join("")}</td><td>${statusPill(s.status)}</td></tr>`).join(""):`<tr><td colspan="6" class="empty">No students match your search.</td></tr>`;
}
function renderDrives(){
 let list=[...drives];const q=($("#driveSearch")?.value||"").toLowerCase();list=list.filter(d=>(d.company+d.role+d.name).toLowerCase().includes(q));
 if($("#driveSort")?.value==="package")list.sort((a,b)=>b.package-a.package);else list.sort((a,b)=>a.date.localeCompare(b.date));
 $("#driveGrid").innerHTML=list.map(d=>`<article class="drive-card"><div class="drive-card-top">${logo(d.company,d.color)}<span class="soft-pill">Placement drive</span></div><h3>${d.name}</h3><div class="company-name">${d.company}</div><div class="role-name">${d.role}</div><div class="drive-info"><div><span>Package</span><b>${d.package.toFixed(2)} LPA</b></div><div><span>Minimum CGPA</span><b>${d.cgpa.toFixed(2)}</b></div><div><span>Drive date</span><b>${dateFmt(d.date)}</b></div><div><span>Job type</span><b>Full time</b></div></div><div class="eligibility">✓ ${d.cgpa<=8.1?"You may be eligible based on sample profile":"Check your CGPA before applying"}</div><div class="card-actions"><button class="card-link" data-details="drive-${d.id}">View details ↗</button><button class="apply-btn" data-apply="drive-${d.id}">Apply now</button></div></article>`).join("")||`<div class="empty">No placement drives found.</div>`;
}
function renderInternships(){
 $("#internshipGrid").innerHTML=internships.map(d=>`<article class="drive-card"><div class="drive-card-top">${logo(d.company,d.color)}<span class="soft-pill">Internship</span></div><h3>${d.role}</h3><div class="company-name">${d.company}</div><div class="role-name">Hands-on industry experience</div><div class="drive-info"><div><span>Monthly stipend</span><b>₹${d.stipend.toLocaleString("en-IN")}</b></div><div><span>Minimum CGPA</span><b>${d.cgpa.toFixed(2)}</b></div><div><span>Start date</span><b>${dateFmt(d.date)}</b></div><div><span>Duration</span><b>As per company</b></div></div><div class="eligibility">✓ Eligibility depends on your academic profile</div><div class="card-actions"><button class="card-link" data-details="intern-${d.id}">View details ↗</button><button class="apply-btn" data-apply="intern-${d.id}">Apply now</button></div></article>`).join("");
}
function renderApplications(){
 const q=($("#applicationSearch")?.value||"").toLowerCase(),st=$("#applicationFilter")?.value||"";
 const list=applications.filter(a=>{const s=students.find(x=>x.id===a.student);return (s.name+a.company+a.role).toLowerCase().includes(q)&&(!st||a.status===st)});
 $("#applicationsTable").innerHTML=list.map(a=>{const s=students.find(x=>x.id===a.student);return `<tr><td>#APP-${String(a.id).padStart(4,"0")}</td><td>${s?.name||"Student"}</td><td><b>${a.company}</b><br><small style="color:#999">${a.role}</small></td><td>${a.date}</td><td>${a.package?`${a.package} LPA`:"—"}</td><td>${statusPill(a.status)}</td></tr>`}).join("")||`<tr><td colspan="6" class="empty">No applications found.</td></tr>`;
}
function renderPlacements(){
 const list=applications.filter(a=>a.status==="Selected");
 $("#placementsTable").innerHTML=list.map(a=>{const s=students.find(x=>x.id===a.student);return `<tr><td>${s?.name||"Student"}</td><td>${a.company}</td><td>${a.role}</td><td>${a.package?`${a.package} LPA`:"—"}</td><td>${a.date}</td></tr>`}).join("")||`<tr><td colspan="5" class="empty">No placement records yet.</td></tr>`;
}
function renderCompanies(){
 const q=($("#companySearch")?.value||"").toLowerCase();
 const list=companies.filter(c=>(c.name+c.industry).toLowerCase().includes(q));
 $("#companyGrid").innerHTML=list.map(c=>`<article class="company-card">${logo(c.name,c.color)}<div><h3>${c.name}</h3><p>${c.industry}</p></div><div class="company-count">${drives.filter(d=>d.company===c.name).length+internships.filter(d=>d.company===c.name).length}<br>roles</div></article>`).join("")||`<div class="empty">No companies found.</div>`;
}
function renderOverview(){
 $("#featuredDrives").innerHTML=drives.slice(0,3).map(d=>`<div class="opportunity">${logo(d.company,d.color)}<div class="opp-main"><b>${d.role}</b><small>${d.company} · ${dateFmt(d.date)}</small></div><div class="opp-meta"><b>${d.package} LPA</b><small>Package</small></div></div>`).join("");
 $("#recentActivity").innerHTML=applications.slice().reverse().slice(0,3).map(a=>{const s=students.find(x=>x.id===a.student);return `<div class="activity"><i class="activity-dot"></i><div><b>${s?.name||"Student"} · ${a.company}</b><small>Application status updated <span style="float:right">${a.date}</span></small><div style="margin-top:7px">${statusPill(a.status)}</div></div></div>`}).join("");
}
function showPage(name){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 $("#page-"+name)?.classList.add("active");
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
 const labels={overview:"Overview",students:"Students",drives:"Placement drives",internships:"Internships",applications:"Applications",placements:"Placements",companies:"Companies"};
 $("#crumbTitle").textContent=labels[name]||"Overview";$("#sidebar").classList.remove("open");window.scrollTo(0,0);
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function openModal(html){$("#modalContent").innerHTML=html;$("#modalBackdrop").classList.add("show")}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
function apply(kind,id){
 const item=kind==="drive"?drives.find(x=>x.id===id):internships.find(x=>x.id===id);
 const type=kind==="drive"?"placement drive":"internship";
 openModal(`<h2>Apply for this opportunity</h2><p>Submit a sample application for <b>${item.role||item.name}</b> at <b>${item.company}</b>.</p><div class="form-row"><label>Student ID</label><select id="applyStudent">${students.map(s=>`<option value="${s.id}">${s.id} · ${s.name} (CGPA ${s.cgpa})</option>`).join("")}</select></div><div class="form-row"><label>Opportunity</label><input value="${item.role||item.name} · ${item.company}" disabled /></div><button class="primary-btn" id="confirmApply">Submit application <span>→</span></button>`);
 $("#confirmApply").onclick=()=>{const sid=Number($("#applyStudent").value),s=students.find(x=>x.id===sid),min=item.cgpa;if(s.cgpa<min){toast(`Not eligible: minimum CGPA is ${min.toFixed(2)}.`);return}
 if(applications.some(a=>a.student===sid&&a.company===item.company&&a.role===(item.role||"Graduate Trainee"))){toast("This student has already applied.");return}
 applications.push({id:Math.max(...applications.map(a=>a.id),0)+1,student:sid,company:item.company,role:item.role||item.name,date:"08 Nov 2026",status:"Applied",package:kind==="drive"?item.package:null});
 closeModal();renderApplications();renderOverview();toast("Application submitted successfully (demo).");
 };
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-page]");if(nav)showPage(nav.dataset.page);
 const go=e.target.closest("[data-goto]");if(go)showPage(go.dataset.goto);
 const ap=e.target.closest("[data-apply]");if(ap){const [kind,id]=ap.dataset.apply.split("-");apply(kind==="drive"?"drive":"intern",Number(id))}
 const detail=e.target.closest("[data-details]");if(detail){const [kind,id]=detail.dataset.details.split("-");const item=kind==="drive"?drives.find(x=>x.id===Number(id)):internships.find(x=>x.id===Number(id));openModal(`<h2>${item.name||item.role}</h2><p><b>${item.company}</b> · ${kind==="drive"?"Placement drive":"Internship"}</p><div class="drive-info"><div><span>Role</span><b>${item.role}</b></div><div><span>Minimum CGPA</span><b>${item.cgpa}</b></div><div><span>${kind==="drive"?"Package":"Monthly stipend"}</span><b>${kind==="drive"?item.package+" LPA":"₹"+item.stipend.toLocaleString("en-IN")}</b></div><div><span>${kind==="drive"?"Drive date":"Start date"}</span><b>${dateFmt(item.date)}</b></div></div><p>This is sample frontend data. Final eligibility and application submission should be validated by the backend.</p><button class="primary-btn" id="modalApply">Apply now →</button>`);$("#modalApply").onclick=()=>{closeModal();apply(kind==="drive"?"drive":"intern",Number(id))}}
});
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
["studentSearch","departmentFilter","statusFilter"].forEach(id=>$("#"+id).addEventListener("input",renderStudents));
["driveSearch","driveSort"].forEach(id=>$("#"+id).addEventListener("input",renderDrives));
["applicationSearch","applicationFilter"].forEach(id=>$("#"+id).addEventListener("input",renderApplications));
$("#companySearch").addEventListener("input",renderCompanies);
$("#modalClose").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#notificationBtn").onclick=()=>toast("You're all caught up!");
$("#helpBtn").onclick=()=>{openModal(`<h2>Welcome to PlaceWise</h2><p>Use the left navigation to explore student profiles, placement drives, internships, applications, placements and companies. This is a frontend-only demo, so changes stay in this browser session.</p><button class="primary-btn" id="gotIt">Got it</button>`);$("#gotIt").onclick=closeModal;};
$("#addStudentBtn").onclick=()=>{openModal(`<h2>Add a student</h2><p>Demo form — records are added only in the current page session.</p><div class="form-row"><label>Student name</label><input id="newName" placeholder="Enter full name"></div><div class="form-row"><label>Email</label><input id="newEmail" placeholder="name@example.com"></div><div class="form-row"><label>Department</label><select id="newDept"><option>CSE</option><option>ISE</option><option>ECE</option><option>AIML</option></select></div><div class="form-row"><label>CGPA</label><input id="newCgpa" type="number" min="0" max="10" step=".01" placeholder="e.g. 8.5"></div><button class="primary-btn" id="saveStudent">Add student →</button>`);$("#saveStudent").onclick=()=>{const name=$("#newName").value.trim(),email=$("#newEmail").value.trim(),cgpa=Number($("#newCgpa").value);if(!name||!email||!email.includes("@")||!Number.isFinite(cgpa)||cgpa<0||cgpa>10){toast("Enter valid student details.");return}students.push({id:Math.max(...students.map(s=>s.id))+1,name,email,dept:$("#newDept").value,cgpa,year:2029,skills:[],status:"Not Placed"});closeModal();renderStudents();toast("Student added (demo).")};};
function csvDownload(filename,rows){const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
$("#exportStudents").onclick=()=>csvDownload("students.csv",[["ID","Name","Email","Department","CGPA","Graduation year","Status"],...students.map(s=>[s.id,s.name,s.email,s.dept,s.cgpa,s.year,s.status])]);
$("#exportApplications").onclick=()=>csvDownload("applications.csv",[["Application ID","Student ID","Company","Role","Date","Status"],...applications.map(a=>[a.id,a.student,a.company,a.role,a.date,a.status])]);
renderOverview();renderStudents();renderDrives();renderInternships();renderApplications();renderPlacements();renderCompanies();
