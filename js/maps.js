// Initialize Map
function initMap() {
    const map = L.map('weatherMap').setView([28.0339, 1.6596], 5); // مركز الجزائر

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // يمكنك إضافة طبقات الطقس هنا
    console.log('Map initialized');
}

// تأكد من تحميل الصفحة أولاً
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('weatherMap')) {
        initMap();
    }
});