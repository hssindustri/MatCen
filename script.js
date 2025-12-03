// Init users dari localStorage
let users = JSON.parse(localStorage.getItem('matcenUsers')) || [];
let currentUser = null;

function showModal(tab = 'login') {
    document.getElementById('modal').style.display = 'block';
    switchTab(tab);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Register
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;

    if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return;
    }

    const newUser = { name, email, pass, role, orders: 0, products: Math.floor(Math.random() * 50) + 10 };
    users.push(newUser);
    localStorage.setItem('matcenUsers', JSON.stringify(users));
    alert('Daftar berhasil! Silakan login.');
    closeModal();
});

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    const user = users.find(u => u.email === email && u.pass === pass);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginSuccess();
    } else {
        alert('Email/password salah!');
    }
});

function loginSuccess() {
    closeModal();
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `
        <h3>Selamat datang, ${currentUser.name} (${currentUser.role})</h3>
        <p>Email: ${currentUser.email}</p>
    `;
    document.getElementById('orders').textContent = currentUser.orders;
    document.getElementById('products').textContent = currentUser.products;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('navLogin').style.display = 'block';
    document.getElementById('navUser').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

// Init on load
window.addEventListener('load', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) loginSuccess();
});

function editProfile() {
    alert('Edit profil: Update data di LocalStorage (simulasi).');
}

// Lanjutkan script sebelumnya (smooth scroll, observer, dll)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate');
    });
});
document.querySelectorAll('.section').forEach(el => observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
