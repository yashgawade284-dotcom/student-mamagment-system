/**
 * ADMIN DASHBOARD MODULE (Mock / Offline Version)
 */

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_STATS = { total_students: 245, total_teachers: 18, total_classes: 12, fee_collected: 1850000 };

let students = [
    { user_id: 10, roll_number: 'R001', first_name: 'Aisha',  last_name: 'Sharma',  class_name: 'Class 10', section: 'A', email: 'aisha@school.edu',  phone: '9876543210' },
    { user_id: 11, roll_number: 'R002', first_name: 'Rahul',  last_name: 'Verma',   class_name: 'Class 10', section: 'A', email: 'rahul@school.edu',  phone: '9876543211' },
    { user_id: 12, roll_number: 'R003', first_name: 'Priya',  last_name: 'Singh',   class_name: 'Class 10', section: 'B', email: 'priya@school.edu',  phone: '9876543212' },
    { user_id: 13, roll_number: 'R004', first_name: 'Amit',   last_name: 'Kumar',   class_name: 'Class 11', section: 'A', email: 'amit@school.edu',   phone: '9876543213' },
    { user_id: 14, roll_number: 'R005', first_name: 'Sneha',  last_name: 'Patel',   class_name: 'Class 11', section: 'B', email: 'sneha@school.edu',  phone: '9876543214' },
    { user_id: 15, roll_number: 'R006', first_name: 'Vikram', last_name: 'Iyer',    class_name: 'Class 12', section: 'A', email: 'vikram@school.edu', phone: '9876543215' }
];

let teachers = [
    { user_id: 20, employee_id: 'T001', first_name: 'Prof. Meena', last_name: 'Kapoor', dept_name: 'Science',     email: 'meena@school.edu',  phone: '9812345671' },
    { user_id: 21, employee_id: 'T002', first_name: 'Prof. Arjun', last_name: 'Nair',   dept_name: 'Mathematics', email: 'arjun@school.edu',  phone: '9812345672' },
    { user_id: 22, employee_id: 'T003', first_name: 'Prof. Sita',  last_name: 'Rao',    dept_name: 'English',     email: 'sita@school.edu',   phone: '9812345673' }
];

const MOCK_CLASSES = [
    { class_id: 1, class_name: 'Class 10', section: 'A' },
    { class_id: 2, class_name: 'Class 10', section: 'B' },
    { class_id: 3, class_name: 'Class 11', section: 'A' },
    { class_id: 4, class_name: 'Class 12', section: 'A' }
];

const MOCK_DEPTS = [
    { dept_id: 1, dept_name: 'Science' },
    { dept_id: 2, dept_name: 'Mathematics' },
    { dept_id: 3, dept_name: 'English' },
    { dept_id: 4, dept_name: 'Arts' }
];

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireRole(['admin'])) return;
    loadUserInfo();
    loadDashboardData();
    loadStudents();
    loadTeachers();
    loadClasses();
    loadDepartments();
});

function loadUserInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('userAvatar').textContent = user.first_name.charAt(0).toUpperCase();
    }
}

async function loadDashboardData() {
    updateSummaryCards(MOCK_STATS);
    initCharts();
}

async function loadAnalytics() { initCharts(); }

function updateSummaryCards(stats) {
    document.getElementById('totalStudents').textContent = stats.total_students;
    document.getElementById('totalTeachers').textContent = stats.total_teachers;
    document.getElementById('totalClasses').textContent  = stats.total_classes;
    document.getElementById('feeCollection').textContent = `₹${(stats.fee_collected || 0).toLocaleString()}`;
}

async function loadStudents() { updateStudentsTable(students); }
async function loadTeachers() { updateTeachersTable(teachers); }

async function loadClasses() {
    const stuClassSelect = document.getElementById('stuClass');
    if (!stuClassSelect) return;
    stuClassSelect.innerHTML = '<option value="">Select Class</option>';
    MOCK_CLASSES.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls.class_id;
        opt.textContent = `${cls.class_name} - ${cls.section}`;
        stuClassSelect.appendChild(opt);
    });
}

async function loadDepartments() {
    const teachDeptSelect = document.getElementById('teachDept');
    if (!teachDeptSelect) return;
    teachDeptSelect.innerHTML = '<option value="">Select Department</option>';
    MOCK_DEPTS.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.dept_id;
        opt.textContent = d.dept_name;
        teachDeptSelect.appendChild(opt);
    });
}

function updateStudentsTable(list) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = list.map(s => `
        <tr>
            <td>${s.roll_number}</td>
            <td>${s.first_name} ${s.last_name}</td>
            <td>${s.class_name || 'N/A'} ${s.section || ''}</td>
            <td>${s.email}</td>
            <td>${s.phone || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editStudent(${s.user_id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.user_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`).join('');
}

function updateTeachersTable(list) {
    const tbody = document.getElementById('teachersTableBody');
    tbody.innerHTML = list.map(t => `
        <tr>
            <td>${t.employee_id}</td>
            <td>${t.first_name} ${t.last_name}</td>
            <td>${t.dept_name || 'N/A'}</td>
            <td>${t.email}</td>
            <td>${t.phone || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editTeacher(${t.user_id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${t.user_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`).join('');
}

function initCharts() {
    initDeptChart([
        { dept_name: 'Science', student_count: 85 },
        { dept_name: 'Mathematics', student_count: 70 },
        { dept_name: 'Arts', student_count: 55 },
        { dept_name: 'Commerce', student_count: 35 }
    ]);
    initFeeChart([
        { month: 1, total: 320000 }, { month: 2, total: 290000 }, { month: 3, total: 410000 },
        { month: 4, total: 380000 }, { month: 5, total: 450000 }, { month: 6, total: 0 }
    ]);
    initRevenueChart();
}

function initDeptChart(deptData) {
    const ctx = document.getElementById('deptChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: { labels: deptData.map(d => d.dept_name), datasets: [{ data: deptData.map(d => d.student_count), backgroundColor: ['rgba(79,70,229,0.8)','rgba(34,197,94,0.8)','rgba(245,158,11,0.8)','rgba(239,68,68,0.8)'], borderWidth: 2, borderColor: '#1e293b' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#cbd5e1', font: { size: 11 } } } } }
    });
}

function initFeeChart(feeData) {
    const ctx = document.getElementById('feeChart').getContext('2d');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = new Array(12).fill(0);
    feeData.forEach(item => { if (item.month >= 1 && item.month <= 12) data[item.month - 1] = item.total; });
    new Chart(ctx, {
        type: 'bar',
        data: { labels: months, datasets: [{ label: 'Fee Collection (₹)', data, backgroundColor: 'rgba(34,197,94,0.8)', borderColor: 'rgba(34,197,94,1)', borderWidth: 2, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: v => '₹' + v.toLocaleString() }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    new Chart(ctx, {
        type: 'line',
        data: { labels: months, datasets: [
            { label: 'Revenue',  data: [320000,290000,410000,380000,450000,420000], borderColor: 'rgba(34,197,94,1)',  backgroundColor: 'rgba(34,197,94,0.1)',  borderWidth: 3, fill: true, tension: 0.4 },
            { label: 'Expenses', data: [210000,195000,250000,230000,270000,260000], borderColor: 'rgba(239,68,68,1)', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 3, fill: true, tension: 0.4 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: v => '₹' + v.toLocaleString() }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

// ── Modals ────────────────────────────────────────────────────────────────────
function showAddStudentModal() { openModal('addStudentModal'); }
function showAddTeacherModal() { openModal('addTeacherModal'); }
function showAddModal() { if (confirm('Click OK to add Student, Cancel to add Teacher')) showAddStudentModal(); else showAddTeacherModal(); }
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

async function saveStudent() {
    const fn = document.getElementById('stuFirstName').value;
    const ln = document.getElementById('stuLastName').value;
    const em = document.getElementById('stuEmail').value;
    const un = document.getElementById('stuUsername').value;
    const rn = document.getElementById('stuRollNumber').value;
    if (!fn || !ln || !em || !un || !rn) { alert('Please fill in all required fields'); return; }
    const newId = students.length + 100;
    students.push({ user_id: newId, roll_number: rn, first_name: fn, last_name: ln, class_name: 'N/A', section: '', email: em, phone: '' });
    MOCK_STATS.total_students++;
    updateSummaryCards(MOCK_STATS);
    updateStudentsTable(students);
    alert('Student added successfully! (Demo mode)');
    closeModal('addStudentModal');
    ['stuFirstName','stuLastName','stuEmail','stuUsername','stuRollNumber'].forEach(id => { document.getElementById(id).value = ''; });
}

async function saveTeacher() {
    const fn = document.getElementById('teachFirstName').value;
    const ln = document.getElementById('teachLastName').value;
    const em = document.getElementById('teachEmail').value;
    const un = document.getElementById('teachUsername').value;
    const ei = document.getElementById('teachEmpId').value;
    if (!fn || !ln || !em || !un || !ei) { alert('Please fill in all required fields'); return; }
    const newId = teachers.length + 200;
    teachers.push({ user_id: newId, employee_id: ei, first_name: fn, last_name: ln, dept_name: 'N/A', email: em, phone: '' });
    MOCK_STATS.total_teachers++;
    updateSummaryCards(MOCK_STATS);
    updateTeachersTable(teachers);
    alert('Teacher added successfully! (Demo mode)');
    closeModal('addTeacherModal');
    ['teachFirstName','teachLastName','teachEmail','teachUsername','teachEmpId'].forEach(id => { document.getElementById(id).value = ''; });
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    students = students.filter(s => s.user_id !== studentId);
    MOCK_STATS.total_students = Math.max(0, MOCK_STATS.total_students - 1);
    updateSummaryCards(MOCK_STATS);
    updateStudentsTable(students);
}

async function deleteTeacher(teacherId) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    teachers = teachers.filter(t => t.user_id !== teacherId);
    MOCK_STATS.total_teachers = Math.max(0, MOCK_STATS.total_teachers - 1);
    updateSummaryCards(MOCK_STATS);
    updateTeachersTable(teachers);
}

function editStudent(id) { alert('Edit Student ID: ' + id + '\n(Edit form coming soon — Demo mode)'); }
function editTeacher(id) { alert('Edit Teacher ID: ' + id + '\n(Edit form coming soon — Demo mode)'); }
function showSection(section) { document.getElementById(section + 'Section')?.scrollIntoView({ behavior: 'smooth' }); }
