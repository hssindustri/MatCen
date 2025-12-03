function showModal() {
    document.getElementById('modal').style.display = 'block';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) closeModal();
}
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Login berhasil! (Simulasi; tambah backend).');
    closeModal();
});
// Observer untuk animasi on-scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
});
document.querySelectorAll('.section').forEach(el => observer.observe(el));
// Parallax hero effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.hero').style.transform = `translateY(${scrolled * 0.5}px)`;
});
// Search functionality (simulasi)
document.querySelector('.search-bar button').addEventListener('click', () => {
    const query = document.querySelector('.search-bar input').value;
    if (query) alert(`Mencari: ${query} (Integrasikan dengan filter kategori).`);
});
