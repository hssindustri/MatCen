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

// ========== DAFTAR PAKAI FIREBASE (INI YANG BARU) ==========
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
        .then((userCredential) => {
            const user = userCredential.user;

            // Simpan data tambahan ke Firestore
            return db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: role,
                orders: 0,
                products: Math.floor(Math.random() * 50) + 10,
                joined: new Date()
            });
        })
        .then(() => {
            alert('Daftar berhasil! Silakan login.');
            document.getElementById('registerForm').reset();
            closeModal();
        })
        .catch((error) => {
            console.error("Error daftar:", error);
            if (error.code === 'auth/email-already-in-use') alert('Email sudah terdaftar!');
            else if (error.code === 'auth/invalid-email') alert('Email tidak valid!');
            else if (error.code === 'auth/weak-password') alert('Password terlalu lemah!');
            else alert('Gagal daftar: ' + error.message);
        });
});

// ========== LOGIN PAKAI FIREBASE ==========
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // Login berhasil, ambil data dari Firestore
            const uid = userCredential.user.uid;
            return db.collection('users').doc(uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                currentUser = { uid: doc.id, ...doc.data() };
                loginSuccess();
                document.getElementById('loginForm').reset();
                closeModal();
            } else {
                alert('Data profil tidak ditemukan!');
            }
        })
        .catch((error) => {
            console.error("Error login:", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert('Email atau password salah!');
            } else if (error.code === 'auth/invalid-email') {
                alert('Format email salah!');
            } else {
                alert('Gagal login: ' + error.message);
            }
        });
});

function logout() {
    auth.signOut().then(() => {
        currentUser = null;
        document.getElementById('navLogin').style.display = 'block';
        document.getElementById('navUser').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
    }).catch((error) => {
        alert('Gagal logout: ' + error.message);
    });
}

// Tambah functions baru
function searchMaterials() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.cat-card');
    cards.forEach(card => {
        const cat = card.dataset.cat.toLowerCase();
        card.style.display = cat.includes(query) ? 'block' : 'none';
    });
}

function editProfile() {
    const newName = prompt('Nama baru:', currentUser.name);
    if (newName) {
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginSuccess(); // Refresh
        alert('Profil diupdate!');
    }
}

function addProduct() {
    alert('Fitur tambah produk: Integrasikan dengan form upload (simulasi).');
}

// Smooth scroll & animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
});
document.querySelectorAll('.section').forEach(el => observer.observe(el));

// Search on enter
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMaterials();
});

// Auto-login kalau sudah pernah login sebelumnya
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    currentUser = { uid: doc.id, ...doc.data() };
                    loginSuccess();
                }
            });
    } else {
        // tidak ada user yang login
        document.getElementById('navLogin').style.display = 'block';
        document.getElementById('navUser').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
    }
});
</script>





