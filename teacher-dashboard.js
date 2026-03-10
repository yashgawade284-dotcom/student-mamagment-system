/**
 * TEACHER DASHBOARD MODULE (Mock / Offline Version)
 */

const MOCK_CLASSES = [
    { class_id: 1, class_name: 'Class 10', section: 'A' },
    { class_id: 2, class_name: 'Class 10', section: 'B' },
    { class_id: 3, class_name: 'Class 11', section: 'A' }
];

const MOCK_STUDENTS = [
    { user_id: 10, roll_number: 'R001', first_name: 'Aisha',  last_name: 'Sharma' },
    { user_id: 11, roll_number: 'R002', first_name: 'Rahul',  last_name: 'Verma' },
    { user_id: 12, roll_number: 'R003', first_name: 'Priya',  last_name: 'Singh' },
    { user_id: 13, roll_number: 'R004', first_name: 'Amit',   last_name: 'Kumar' },
    { user_id: 14, roll_number: 'R005', first_name: 'Sneha',  last_name: 'Patel' },
    { user_id: 15, roll_number: 'R006', first_name: 'Vikram', last_name: 'Iyer' }
];

const MOCK_ANALYTICS = {
    subject_performance: [
        { subject_name: 'Mathematics', avg_marks: 74 },
        { subject_name: 'Physics',     avg_marks: 68 },
        { subject_name: 'Chemistry',   avg_marks: 72 }
    ],
    student_performance: [
        { student_id: 10, avg_marks: 82 }, { student_id: 11, avg_marks: 55 },
        { student_id: 12, avg_marks: 91 }, { student_id: 13, avg_marks: 30 },
        { student_id: 14, avg_marks: 77 }, { student_id: 15, avg_marks: 65 }
    ]
};

const MOCK_SUBJECTS = [
    { subject_id: 1, subject_name: 'Mathematics' },
    { subject_id: 2, subject_name: 'Physics' },
    { subject_id: 3, subject_name: 'Chemistry' }
];

let currentClassId = 1;
let students = [...MOCK_STUDENTS];

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireRole(['teacher'])) return;
    loadUserInfo();
    loadClasses();
    const dateEl = document.getElementById('attendanceDate');
    if (dateEl) dateEl.valueAsDate = new Date();
});

function loadUserInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('userAvatar').textContent = user.first_name.charAt(0).toUpperCase();
    }
}

async function loadClasses() {
    const classSelect = document.getElementById('classSelect');
    classSelect.innerHTML = '<option value="">Select Class</option>';
    MOCK_CLASSES.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.class_id;
        option.textContent = `${cls.class_name} - ${cls.section}`;
        classSelect.appendChild(option);
    });
    currentClassId = MOCK_CLASSES[0].class_id;
    classSelect.value = currentClassId;
    loadClassData(currentClassId);
    classSelect.addEventListener('change', (e) => {
        currentClassId = e.target.value;
        if (currentClassId) loadClassData(currentClassId);
    });
}

async function loadClassData(classId) {
    students = [...MOCK_STUDENTS];
    document.getElementById('totalStudents').textContent = students.length;
    updateStudentTable(students);
    updateSummaryCards(MOCK_ANALYTICS);
    initCharts(MOCK_ANALYTICS);
    loadSubjects(classId);
}

async function loadSubjects(classId) {
    const subjectSelect = document.getElementById('attendanceSubject');
    if (!subjectSelect) return;
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    MOCK_SUBJECTS.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.subject_id;
        opt.textContent = s.subject_name;
        subjectSelect.appendChild(opt);
    });
}

function updateSummaryCards(data) {
    const sp = data.student_performance;
    if (sp && sp.length > 0) {
        const avgMarks = sp.reduce((s, x) => s + (x.avg_marks || 0), 0) / sp.length;
        document.getElementById('avgMarks').textContent = avgMarks.toFixed(1);
        const passCount = sp.filter(s => (s.avg_marks || 0) >= 35).length;
        document.getElementById('passRate').textContent = ((passCount / sp.length) * 100).toFixed(0) + '%';
    }
}

function updateStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.roll_number}</td>
            <td>${s.first_name} ${s.last_name}</td>
            <td>-</td><td>-</td>
            <td><span class="status-badge present">Active</span></td>
        </tr>`).join('');
}

function initCharts(data) {
    initAttendanceChart(data.subject_performance);
    initPassFailChart(data.student_performance);
    initMarksDistChart(data.student_performance);
    initAttendanceTrendChart();
}

function initAttendanceChart(subjectPerformance) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    if (window.attendanceChartInstance) window.attendanceChartInstance.destroy();
    window.attendanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: subjectPerformance.map(s => s.subject_name), datasets: [{ label: 'Average Attendance (%)', data: [88, 82, 91], backgroundColor: 'rgba(59,130,246,0.8)', borderColor: 'rgba(59,130,246,1)', borderWidth: 2, borderRadius: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

function initPassFailChart(sp) {
    const ctx = document.getElementById('passFailChart').getContext('2d');
    if (window.passFailChartInstance) window.passFailChartInstance.destroy();
    const passCount = sp.filter(s => (s.avg_marks || 0) >= 35).length;
    window.passFailChartInstance = new Chart(ctx, {
        type: 'pie',
        data: { labels: ['Pass', 'Fail'], datasets: [{ data: [passCount, sp.length - passCount], backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)'], borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)'], borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
    });
}

function initMarksDistChart(sp) {
    const ctx = document.getElementById('marksDistChart').getContext('2d');
    if (window.marksDistChartInstance) window.marksDistChartInstance.destroy();
    const ranges = { '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0, '50-59': 0, '40-49': 0, 'Below 40': 0 };
    sp.forEach(s => {
        const m = s.avg_marks || 0;
        if (m >= 90) ranges['90-100']++;
        else if (m >= 80) ranges['80-89']++;
        else if (m >= 70) ranges['70-79']++;
        else if (m >= 60) ranges['60-69']++;
        else if (m >= 50) ranges['50-59']++;
        else if (m >= 40) ranges['40-49']++;
        else ranges['Below 40']++;
    });
    window.marksDistChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: Object.keys(ranges), datasets: [{ label: 'Number of Students', data: Object.values(ranges), backgroundColor: 'rgba(139,92,246,0.8)', borderColor: 'rgba(139,92,246,1)', borderWidth: 2, borderRadius: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

function initAttendanceTrendChart() {
    const ctx = document.getElementById('attendanceTrendChart').getContext('2d');
    if (window.attendanceTrendChartInstance) window.attendanceTrendChartInstance.destroy();
    window.attendanceTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Monthly Attendance (%)', data: [82, 85, 79, 88, 91, 86], borderColor: 'rgba(6,182,212,1)', backgroundColor: 'rgba(6,182,212,0.1)', borderWidth: 3, fill: true, tension: 0.4, pointBackgroundColor: 'rgba(6,182,212,1)', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8', callback: v => v + '%' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

function showAttendanceModal() {
    if (!currentClassId) { alert('Please select a class first'); return; }
    const container = document.getElementById('attendanceStudentList');
    container.innerHTML = students.map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid var(--border-color);">
            <span>${s.roll_number} - ${s.first_name} ${s.last_name}</span>
            <select class="attendance-status" data-student-id="${s.user_id}" style="width:120px;">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
            </select>
        </div>`).join('');
    openModal('attendanceModal');
}

function showMarksModal() {
    if (!currentClassId) { alert('Please select a class first'); return; }
    const container = document.getElementById('marksStudentList');
    container.innerHTML = students.map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid var(--border-color);">
            <span>${s.roll_number} - ${s.first_name} ${s.last_name}</span>
            <input type="number" class="marks-input" data-student-id="${s.user_id}" placeholder="Marks" min="0" max="100" style="width:100px;padding:8px;">
        </div>`).join('');
    openModal('marksModal');
}

function showAnnouncementModal() { openModal('announcementModal'); }
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

async function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const subjectId = document.getElementById('attendanceSubject').value;
    if (!date || !subjectId) { alert('Please select date and subject'); return; }
    alert('Attendance saved successfully! (Demo mode — data is not persisted)');
    closeModal('attendanceModal');
}

async function saveMarks() {
    const examId = document.getElementById('marksExam').value;
    if (!examId) { alert('Please select an exam'); return; }
    alert('Marks saved successfully! (Demo mode — data is not persisted)');
    closeModal('marksModal');
}

async function saveAnnouncement() {
    const title = document.getElementById('annTitle').value;
    const content = document.getElementById('annContent').value;
    if (!title || !content) { alert('Please fill in all fields'); return; }
    alert('Announcement posted successfully! (Demo mode — data is not persisted)');
    closeModal('announcementModal');
    document.getElementById('annTitle').value = '';
    document.getElementById('annContent').value = '';
}

function showStudentsList() { document.getElementById('studentTable')?.scrollIntoView({ behavior: 'smooth' }); }
