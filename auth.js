/**
 * =====================================================
 * AUTHENTICATION MODULE (Mock / Offline Version)
 * =====================================================
 * No backend required — uses demo credentials stored locally.
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ── Demo Users ────────────────────────────────────────────────────────────────
const DEMO_USERS = {
    'student1': {
        password: 'student123',
        user: { user_id: 1, username: 'student1', first_name: 'Aisha', last_name: 'Sharma', role: 'student', email: 'aisha@school.edu' }
    },
    'student2': {
        password: 'student123',
        user: { user_id: 2, username: 'student2', first_name: 'Rahul', last_name: 'Verma', role: 'student', email: 'rahul@school.edu' }
    },
    'teacher1': {
        password: 'teacher123',
        user: { user_id: 3, username: 'teacher1', first_name: 'Prof. Meena', last_name: 'Kapoor', role: 'teacher', email: 'meena@school.edu' }
    },
    'teacher2': {
        password: 'teacher123',
        user: { user_id: 4, username: 'teacher2', first_name: 'Prof. Arjun', last_name: 'Nair', role: 'teacher', email: 'arjun@school.edu' }
    },
    'admin': {
        password: 'admin123',
        user: { user_id: 5, username: 'admin', first_name: 'System', last_name: 'Admin', role: 'admin', email: 'admin@school.edu' }
    }
};

// ── Page Load ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        await login(username, password);
    });
}

// ── Core Auth Functions ───────────────────────────────────────────────────────
async function login(username, password) {
    const record = DEMO_USERS[username.trim().toLowerCase()];
    if (record && record.password === password) {
        sessionStorage.setItem('user', JSON.stringify(record.user));
        redirectToDashboard(record.user.role);
    } else {
        showAlert('Invalid username or password. Please use the demo credentials shown below.', 'error');
    }
}

async function logout() {
    sessionStorage.removeItem('user');
    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = inPages ? '../index.html' : 'index.html';
}

async function checkAuthStatus() {
    const user = getCurrentUser();
    const path = window.location.pathname;

    if (user) {
        if (
            path.includes('index.html') ||
            path.endsWith('/frontend/') ||
            path.includes('student-login') ||
            path.includes('teacher-login') ||
            path.includes('admin-login')
        ) {
            redirectToDashboard(user.role);
        }
    } else {
        if (path.includes('/pages/')) {
            window.location.href = '../index.html';
        }
    }
}

function redirectToDashboard(role) {
    switch (role) {
        case 'student': 
            window.location.href = 'student-dashboard.html'; 
            break;
        case 'teacher': 
            window.location.href = 'teacher-dashboard.html'; 
            break;
        case 'admin':   
            window.location.href = 'admin-dashboard.html'; 
            break;
        default: 
            showAlert('Invalid user role', 'error');
    
    }
}

function getCurrentUser() {
    const u = sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert alert-${type} show`;
        setTimeout(() => alertBox.classList.remove('show'), 6000);
    }
}

function requireRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user) { window.location.href = '../index.html'; return false; }
    if (!allowedRoles.includes(user.role)) { redirectToDashboard(user.role); return false; }
    return true;
}

window.Auth = { login, logout, checkAuthStatus, getCurrentUser, showAlert, requireRole, redirectToDashboard, API_BASE_URL };
