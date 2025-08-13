// Global variables
let properties = [];
let facilities = [];

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadData();
    initBookingForm();
    initModal();
});

// Navigation
function initNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Load data from JSON files
async function loadData() {
    try {
        // Load properties
        const propertiesResponse = await fetch('./data/properties.json');
        properties = await propertiesResponse.json();
        renderProperties();
        
        // Load facilities
        const facilitiesResponse = await fetch('./data/facilities.json');
        facilities = await facilitiesResponse.json();
        renderFacilities();
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to default data if JSON files not found
        loadFallbackData();
    }
}

// Fallback data jika file JSON tidak ditemukan
function loadFallbackData() {
    properties = [
        {
            id: 1,
            name: "Glamping Tent Premium",
            type: "glamping",
            description: "Tenda glamping mewah dengan pemandangan pegunungan yang menakjubkan",
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500",
            features: ["AC", "Kamar Mandi Dalam", "Teras Pribadi", "WiFi"],
            gallery: [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500",
                "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500"
            ]
        },
        {
            id: 2,
            name: "Villa Family",
            type: "villa",
            description: "Villa keluarga dengan ruang luas dan fasilitas lengkap",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
            features: ["3 Kamar Tidur", "Dapur Lengkap", "Ruang Keluarga", "Taman Pribadi"],
            gallery: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500"
            ]
        }
    ];
    
    facilities = [
        {
            icon: "🏊‍♂️",
            title: "Kolam Renang",
            description: "Kolam renang infinity dengan pemandangan pegunungan"
        },
        {
            icon: "🍽️",
            title: "Restaurant",
            description: "Restoran dengan menu lokal dan internasional"
        },
        {
            icon: "🅿️",
            title: "Parkir Gratis",
            description: "Area parkir luas dan aman untuk kendaraan Anda"
        },
        {
            icon: "📶",
            title: "WiFi Gratis",
            description: "Koneksi internet cepat di seluruh area resort"
        }
    ];
    
    renderProperties();
    renderFacilities();
}

// Render properties
function renderProperties() {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;
    
    grid.innerHTML = properties.map(property => `
        <div class="property-card">
            <img src="${property.image}" alt="${property.name}" class="property-image">
            <div class="property-content">
                <h3 class="property-title">${property.name}</h3>
                <p class="property-description">${property.description}</p>
                <div class="property-features">
                    ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="property-actions">
                    <button class="btn-detail" onclick="openDetail(${property.id})">
                        👁️ Lihat Detail
                    </button>
                    <button class="btn-book" onclick="bookProperty('${property.name}')">
                        📱 Booking
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render facilities
function renderFacilities() {
    const grid = document.getElementById('facilities-grid');
    if (!grid) return;
    
    grid.innerHTML = facilities.map(facility => `
        <div class="facility-item">
            <span class="facility-icon">${facility.icon}</span>
            <h3>${facility.title}</h3>
            <p>${facility.description}</p>
        </div>
    `).join('');
}

// Detail modal
function initModal() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function openDetail(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    if (!modal || !title || !content) return;
    
    title.innerHTML = `*_${property.name.toUpperCase()}_*`;
    
    // Generate detail content seperti format yang diminta
    const detailHTML = `
        <div class="detail-header">
            <img src="${property.image}" alt="${property.name}" class="detail-image">
            <div class="detail-location">${property.location || 'Pleseran, Tawangmangu'}</div>
        </div>
        
        <div class="detail-info">
            <p><strong>Tersedia ${property.units || '5'} Unit</strong></p>
            <p>Cocok untuk ${property.suitableFor || 'Keluarga kecil, dan Pasangan suami istri..'}</p>
            <p>Pas untuk Honey moon 😍🥰</p>
        </div>
        
        <div class="detail-facilities">
            <h3><strong>Fasilitas :</strong></h3>
            <div class="facilities-list">
                ${property.features.map(feature => `<p>🔹 ${feature}</p>`).join('')}
                ${property.type === 'glamping' ? `
                    <p>🔹 Mini Privatpool cukup besar</p>
                    <p>🔹 View bukit dan hutan pinus</p>
                    <p>🔹 Dekat dengan sungai bisa untuk ciblon</p>
                    <p>🔹 Dekat dengan wisata pleseran</p>
                    <p>🔹 Diskon 50% masuk wisata buper Pleseran</p>
                    <p>🔹 Kapasitas ${property.capacity}</p>
                    <p>🥩 Free BBQ</p>
                    <p>🏕️ Free tenda</p>
                ` : ''}
            </div>
        </div>
        
        <div class="detail-notes">
            <h3>📛 Note:</h3>
            <p>⏩ Check in jam ${property.checkIn || '2 siang'}</p>
            <p>⏪ Check out jam ${property.checkOut || '12'}</p>
            <p>🚻 Bukti nikah untuk pasangan</p>
            <p>🍺 No miras</p>
            <p>🔞 No mesum</p>
            <p>🏴‍☠️ No drugs</p>
        </div>
        
        <div class="detail-footer">
            <p>Terima kasih atas perhatian nya... 🙏🙏🙏</p>
        </div>
        
        <div class="detail-actions">
            <button onclick="closeModal()" class="btn-close">Tutup</button>
            <button onclick="bookPropertyDetail('${property.name}')" class="btn-book-detail">📱 Booking WhatsApp</button>
        </div>
    `;
    
    content.innerHTML = detailHTML;
    modal.style.display = 'block';
}

function bookPropertyDetail(propertyName) {
    const message = `*${propertyName.toUpperCase()}*
Pleseran, Tawangmangu

Halo, saya tertarik untuk booking ${propertyName}. 
Mohon informasi ketersediaan dan harga detail.

Terima kasih! 🙏`;
    
    const whatsappNumber = '6281234567890';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function closeModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Booking functions
function bookProperty(propertyName) {
    // Scroll to booking form
    document.getElementById('reservasi').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Set property type in form
    const akomodasiSelect = document.getElementById('akomodasi');
    if (akomodasiSelect) {
        akomodasiSelect.value = propertyName;
    }
}

function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });
    
    // Set minimum date to today
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const today = new Date().toISOString().split('T')[0];
    
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;
    
    // Update checkout minimum when checkin changes
    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', function() {
            checkoutInput.min = this.value;
        });
    }
}

function sendWhatsAppMessage() {
    const nama = document.getElementById('nama').value;
    const telepon = document.getElementById('telepon').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const tamu = document.getElementById('tamu').value;
    const akomodasi = document.getElementById('akomodasi').value;
    const catatan = document.getElementById('catatan').value;
    
    // Format tanggal
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Buat pesan WhatsApp
    let message = `*RESERVASI PESONA GLAMPING TAWANGMANGU*\n\n`;
    message += `👤 *Nama:* ${nama}\n`;
    message += `📱 *Telepon:* ${telepon}\n`;
    message += `📅 *Check-in:* ${formatDate(checkin)}\n`;
    message += `📅 *Check-out:* ${formatDate(checkout)}\n`;
    message += `👥 *Jumlah Tamu:* ${tamu}\n`;
    message += `🏕️ *Akomodasi:* ${akomodasi}\n`;
    
    if (catatan.trim()) {
        message += `📝 *Catatan:* ${catatan}\n`;
    }
    
    message += `\n✨ Terima kasih! Mohon konfirmasi ketersediaan dan harga.\n`;
    
    // WhatsApp number (ganti dengan nomor yang benar)
    const whatsappNumber = '6281234567890';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Smooth reveal animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.property-card, .advantage-item, .facility-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations after content is loaded
setTimeout(initScrollAnimations, 500);