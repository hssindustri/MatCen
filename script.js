let currentUser = null;

// Modal functions
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

    loginForm.style.display = tab === 'login' ? 'block' : 'none';
    registerForm.style.display = tab === 'login' ? 'none' : 'block';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(tab === 'login' ? 'Login' : 'Daftar')) {
            btn.classList.add('active');
        }
    });
}

// ========== DAFTAR PAKAI FIREBASE ==========
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPass').value;
    const role  = document.getElementById('regRole').value;

    if (pass.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }

    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            return db.collection('users').doc(cred.user.uid).set({
                name, email, role, orders: 0,
                products: Math.floor(Math.random() * 50) + 10,
                joined: new Date()
            });
        })
        .then(() => {
            alert('Daftar berhasil! Silakan login.');
            document.getElementById('registerForm').reset();
            closeModal();
        })
        .catch(err => {
            alert(err.message);
        });
});

// ========== LOGIN PAKAI FIREBASE ==========
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(cred => {
            return db.collection('users').doc(cred.user.uid).get();
        })
        .then(doc => {
            if (doc.exists) {
                currentUser = { uid: doc.id, ...doc.data() };
                loginSuccess();
                closeModal();
            }
        })
        .catch(err => alert(err.message));
});

function loginSuccess() {
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navUser').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userInfo').innerHTML = `
        <p>Selamat datang, <strong>${currentUser.name}</strong>!</p>
        <p>Role: ${currentUser.role}</p>
        <p>Bergabung: ${new Date(currentUser.joined?.seconds*1000 || Date.now()).toLocaleDateString('id-ID')}</p>
    `;
    document.getElementById('orders').textContent = currentUser.orders || 0;
    document.getElementById('products').textContent = currentUser.products || 0;
    document.getElementById('dashboard').style.display = 'block';

    // Chart sederhana
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels: ['Jan','Feb','Mar','Apr'], datasets: [{ label: 'Aktivitas', data: [10,20,15,30], borderColor: '#F15A24' }] },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

function logout() {
    auth.signOut();
}

// Auto-login
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                currentUser = { uid: doc.id, ...doc.data() };
                loginSuccess();
            }
        });
    }
});

// Tombol Daftar & Login (fix ID)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnRegisterHero')?.addEventListener('click', () => showModal('register'));
    document.getElementById('linkLogin')?.addEventListener('click', e => { e.preventDefault(); showModal('login'); });
});

// Search
function searchMaterials() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.cat-card').forEach(card => {
        card.style.display = card.dataset.cat.toLowerCase().includes(query) ? 'block' : 'none';
    });
}
