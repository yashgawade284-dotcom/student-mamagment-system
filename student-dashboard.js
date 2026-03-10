/**
 * STUDENT DASHBOARD MODULE (Mock / Offline Version)
 */

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_STUDENT_DATA = {
    stats: { attendance_percentage: 87, average_marks: 76, total_subjects: 6, fee_status: 'Paid' },
    marks: {
        subject_wise: [
            { subject_name: 'Mathematics', avg_marks: 82, total_marks: 100 },
            { subject_name: 'Physics',     avg_marks: 74, total_marks: 100 },
            { subject_name: 'Chemistry',   avg_marks: 68, total_marks: 100 },
            { subject_name: 'English',     avg_marks: 88, total_marks: 100 },
            { subject_name: 'Computer Sc', avg_marks: 91, total_marks: 100 },
            { subject_name: 'History',     avg_marks: 72, total_marks: 100 }
        ],
        performance_trend: [
            { exam_date: '2024-01-15', marks_obtained: 68, total_marks: 100 },
            { exam_date: '2024-02-20', marks_obtained: 74, total_marks: 100 },
            { exam_date: '2024-03-18', marks_obtained: 79, total_marks: 100 },
            { exam_date: '2024-04-22', marks_obtained: 82, total_marks: 100 },
            { exam_date: '2024-05-10', marks_obtained: 76, total_marks: 100 }
        ]
    },
    attendance: {
        subject_wise: [
            { subject_name: 'Mathematics', present: 22, total: 25 },
            { subject_name: 'Physics',     present: 20, total: 25 },
            { subject_name: 'Chemistry',   present: 23, total: 25 },
            { subject_name: 'English',     present: 24, total: 25 },
            { subject_name: 'Computer Sc', present: 25, total: 25 },
            { subject_name: 'History',     present: 18, total: 25 }
        ]
    }
};

const MOCK_ANNOUNCEMENTS = [
    { title: 'Mid-Term Exams Schedule Released', content: 'Mid-term examinations will be held from 15th to 22nd of this month. Please check the timetable on the notice board.', posted_by_name: 'Admin', created_at: new Date(Date.now() - 86400000).toISOString(), priority: 'high', read_at: null },
    { title: 'Sports Day Announced', content: 'Annual Sports Day is scheduled for next Friday. All students are encouraged to participate in at least one event.', posted_by_name: 'Prof. Meena Kapoor', created_at: new Date(Date.now() - 172800000).toISOString(), priority: 'normal', read_at: new Date().toISOString() },
    { title: 'Library Hours Extended', content: 'The library will remain open until 8 PM on all weekdays starting this week to support exam preparation.', posted_by_name: 'Admin', created_at: new Date(Date.now() - 259200000).toISOString(), priority: 'low', read_at: new Date().toISOString() }
];

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireRole(['student'])) return;
    loadUserInfo();
    loadDashboardData();
    loadAnnouncements();
});

function loadUserInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('userAvatar').textContent = user.first_name.charAt(0).toUpperCase();
    }
}

async function loadDashboardData() {
    const data = MOCK_STUDENT_DATA;
    updateSummaryCards(data.stats);
    initCharts(data);
}

function updateSummaryCards(stats) {
    document.getElementById('attendancePercent').textContent = `${stats.attendance_percentage}%`;
    document.getElementById('avgMarks').textContent = stats.average_marks;
    document.getElementById('totalSubjects').textContent = stats.total_subjects;
    const feeStatusEl = document.getElementById('feeStatus');
    feeStatusEl.textContent = stats.fee_status;
    feeStatusEl.className = `card-status ${stats.fee_status === 'Paid' ? 'paid' : 'pending'}`;
}

function initCharts(data) {
    initMarksChart(data.marks.subject_wise);
    initAttendanceChart(data.attendance.subject_wise);
    initPerformanceChart(data.marks.performance_trend);
}

function initMarksChart(subjectMarks) {
    const ctx = document.getElementById('marksChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjectMarks.map(s => s.subject_name),
            datasets: [
                { label: 'Marks Obtained', data: subjectMarks.map(s => s.avg_marks),  backgroundColor: 'rgba(79,70,229,0.8)',  borderColor: 'rgba(79,70,229,1)',  borderWidth: 2, borderRadius: 8 },
                { label: 'Total Marks',    data: subjectMarks.map(s => s.total_marks), backgroundColor: 'rgba(148,163,184,0.3)', borderColor: 'rgba(148,163,184,0.5)', borderWidth: 2, borderRadius: 8 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

function initAttendanceChart(attendanceData) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    let totalClasses = 0, totalPresent = 0;
    attendanceData.forEach(i => { totalClasses += i.total; totalPresent += i.present; });
    new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Present', 'Absent'], datasets: [{ data: [totalPresent, totalClasses - totalPresent], backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)'], borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)'], borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
    });
}

function initPerformanceChart(performanceData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const labels = performanceData.map(p => { const d = new Date(p.exam_date); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); });
    const data   = performanceData.map(p => (p.marks_obtained / p.total_marks) * 100);
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Performance (%)', data, borderColor: 'rgba(6,182,212,1)', backgroundColor: 'rgba(6,182,212,0.1)', borderWidth: 3, fill: true, tension: 0.4, pointBackgroundColor: 'rgba(6,182,212,1)', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8', callback: v => v + '%' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

async function loadAnnouncements() {
    displayAnnouncements(MOCK_ANNOUNCEMENTS);
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcementList');
    if (!container) return;
    if (announcements.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No announcements</p>'; return; }
    container.innerHTML = announcements.slice(0, 5).map(ann => `
        <div class="announcement-item ${ann.priority}">
            <div class="announcement-icon"><i class="fas fa-bullhorn"></i></div>
            <div class="announcement-content">
                <h4>${ann.title}</h4>
                <p>${ann.content.substring(0, 100)}${ann.content.length > 100 ? '...' : ''}</p>
                <div class="announcement-meta">
                    <span><i class="fas fa-user"></i> ${ann.posted_by_name}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(ann.created_at)}</span>
                </div>
            </div>
        </div>`).join('');
    const unreadCount = announcements.filter(a => !a.read_at).length;
    const badge = document.getElementById('notifBadge');
    if (badge) badge.textContent = unreadCount;
}

function formatDate(dateString) {
    const date = new Date(dateString), now = new Date(), diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toggleChatbot() { document.getElementById('chatbotContainer').classList.toggle('open'); }

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    const responses = [
        'Your attendance this semester is 87%. Keep it up!',
        'Your average marks are 76 out of 100.',
        'You have 6 subjects enrolled this semester.',
        'Your fee status is: Paid. No dues pending.',
        'Next exam is scheduled for next week. Please check the announcements.',
        'For more information, please contact your class teacher.'
    ];
    setTimeout(() => addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot'), 600);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showSection(section) { console.log('Showing section:', section); }
function showAnnouncements() { document.querySelector('.announcements-section')?.scrollIntoView({ behavior: 'smooth' }); }
