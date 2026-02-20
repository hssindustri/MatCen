let currentUser = null;

// Contoh Logika Pendaftaran yang Benar
auth.createUserWithEmailAndPassword(email, pass)
    .then((userCredential) => {
        const user = userCredential.user;
        
        // PENTING: Simpan profil ke Firestore (collection 'users')
        return db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: role,              // Menangkap pilihan 'IKM' atau 'Fasilitator'
            status: 'pending',       // <-- Pastikan ada atribut status ini!
            verified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .then(() => {
        alert("Pendaftaran berhasil! Menunggu verifikasi.");
        // Redirect atau tutup modal
    })
    .catch((error) => {
        console.error("Error pendaftaran: ", error);
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


