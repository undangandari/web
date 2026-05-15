// file: js/utils/utils-rsvp.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==========================================
// 1. KONFIGURASI DATABASE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAbpnsGjy9p8doAtZx-Jc1U1nod3M-S90Y",
    authDomain: "sistem-rsvp.firebaseapp.com",
    projectId: "sistem-rsvp",
    storageBucket: "sistem-rsvp.firebasestorage.app",
    messagingSenderId: "634798818741",
    appId: "1:634798818741:web:83d56bf3122968dc86c5fc"
};
const app = initializeApp(firebaseConfig); 
const db = getFirestore(app);
let unsubscribe = null; 

// ==========================================
// 2. PENGATURAN MODE (Persiapan Fitur Depan)
// ==========================================
const isDemoMode = false;     // Set ke 'true' untuk menonaktifkan pengiriman pesan (Katalog Web)
const isSpamFilterOn = true;  // Set ke 'true' untuk blokir kata kasar & batasi 1x kirim/device

// ==========================================
// 3. UI KONTROL MODAL (ANIMASI)
// ==========================================
window.bukaModalRSVP = function() {
    const overlay = document.getElementById('modal-rsvp-overlay');
    const card = document.getElementById('modal-rsvp-card');
    const frame = document.querySelector('.frame'); // Elemen ornamen bunga
    
    if(overlay && card) {
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Animasi Sinematik: Bunga memudar pelan, bukan hilang mendadak
    if(frame) {
        frame.style.transition = 'opacity 0.4s ease';
        frame.style.opacity = '0'; 
    }
};

window.tutupModalRSVP = function() {
    const overlay = document.getElementById('modal-rsvp-overlay');
    const card = document.getElementById('modal-rsvp-card');
    const frame = document.querySelector('.frame');
    
    if(overlay && card) {
        overlay.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400);
    }
    
    // Animasi Sinematik: Bunga kembali muncul pelan
    if(frame) {
        frame.style.opacity = '1';
    }
};

// ==========================================
// 4. HELPER FUNGSI (WAKTU & WARNA AVATAR)
// ==========================================
function timeAgo(dateInput) { 
    if (!dateInput) return "Baru saja"; 
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput); 
    const seconds = Math.round((new Date() - date) / 1000); const minutes = Math.round(seconds / 60); const hours = Math.round(minutes / 60); const days = Math.round(hours / 24); 
    if (seconds < 60) return "Baru saja"; if (minutes < 60) return `${minutes} menit yll`; if (hours < 24) return `${hours} jam yll`; if (days === 1) return `Kemarin`; return `${days} hari yll`; 
}

function getAvatarColor(name) { 
    const colors = ['#a67c52', '#8b5a2b', '#b38b6d', '#cd853f', '#d2b48c', '#64748b', '#4a4a4a']; 
    let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash); 
    return colors[Math.abs(hash) % colors.length]; 
}

// ==========================================
// 5. READ DATA (LIVE SNAPSHOT)
// ==========================================
window.initFirebaseRSVP = function() {
    const brideId = document.getElementById('g_brideId') && document.getElementById('g_brideId').value ? document.getElementById('g_brideId').value : 'lisa-dan-palmer';
    const daftarUcapan = document.getElementById('daftar-ucapan'); 
    const countHadir = document.getElementById('count-hadir'); 
    const countTidak = document.getElementById('count-tidak'); 
    const countRagu = document.getElementById('count-ragu');

    if(!daftarUcapan) return; 

    const masterCollection = collection(db, 'rsvps');
    const q = query(masterCollection, where("brideId", "==", brideId));
    
    if (unsubscribe) unsubscribe(); 

    unsubscribe = onSnapshot(q, (snapshot) => {
        let ucapanHTML = ''; let hadir = 0, tidakHadir = 0, ragu = 0;
        const dataPesan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dataPesan.sort((a, b) => { const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now(); const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now(); return timeB - timeA; });
        
        if(dataPesan.length === 0) { 
            daftarUcapan.innerHTML = '<div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px; font-style: italic;">Belum ada ucapan. Jadilah yang pertama!</div>'; 
            if(countHadir) countHadir.innerText = "0"; if(countTidak) countTidak.innerText = "0"; if(countRagu) countRagu.innerText = "0"; 
            return; 
        }
        
        dataPesan.forEach(data => {
            if (data.kehadiran === 'Hadir') hadir++; else if (data.kehadiran === 'Tidak Hadir') tidakHadir++; else ragu++;
            const inisial = data.nama.substring(0, 2).toUpperCase(); const bgColor = getAvatarColor(data.nama); const waktu = timeAgo(data.timestamp);
            
            let badgeColor = ''; let badgeText = '';
            if (data.kehadiran === 'Hadir') { badgeColor = '#2ecc71'; badgeText = 'Hadir'; }
            else if (data.kehadiran === 'Tidak Hadir') { badgeColor = '#e74c3c'; badgeText = 'Tidak Hadir'; }
            else { badgeColor = '#f1c40f'; badgeText = 'Masih Ragu'; }
            
            ucapanHTML += `
            <div style="background: white; border: 1px solid #f0f0f0; border-radius: 12px; padding: 15px; display: flex; gap: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); text-align: left; transition: 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${bgColor}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">${inisial}</div>
                <div style="flex-grow: 1; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                        <strong style="font-size: 13px; color: #333; font-family: var(--font-base);">${data.nama}</strong>
                        <span style="font-size: 9px; background: ${badgeColor}; color: white; padding: 3px 8px; border-radius: 20px; font-weight: bold; letter-spacing: 0.5px;">${badgeText}</span>
                    </div>
                    <p style="font-size: 12px; color: #666; margin: 0 0 8px 0; line-height: 1.5; font-family: var(--font-base); text-align: left;">${data.ucapan}</p>
                    <div style="font-size: 10px; color: #aaa; text-align: left; font-family: var(--font-base);">${waktu}</div>
                </div>
            </div>`;
        });
        
        daftarUcapan.innerHTML = ucapanHTML;
        if(countHadir) countHadir.innerText = hadir;
        if(countTidak) countTidak.innerText = tidakHadir;
        if(countRagu) countRagu.innerText = ragu;
    });
};

// ==========================================
// 6. WRITE DATA (KIRIM PESAN & FILTER)
// ==========================================
window.kirimRsvpPreview = async function() {
    // Cek Mode Demo
    if(isDemoMode) {
        alert("Mode Demo Aktif: Maaf, RSVP dan ucapan tidak dapat dikirim.");
        return;
    }

    const brideId = document.getElementById('g_brideId') && document.getElementById('g_brideId').value ? document.getElementById('g_brideId').value : 'lisa-dan-palmer';
    const inputNama = document.getElementById('rsvp-nama'); 
    const inputKehadiran = document.getElementById('rsvp-hadir');
    const inputUcapan = document.getElementById('rsvp-pesan');
    const btnKirim = document.getElementById('btn-kirim-rsvp');

    const namaVal = inputNama.value.trim(); 
    const ucapanVal = inputUcapan.value.trim(); 
    const kehadiranVal = inputKehadiran.value;

    if (!namaVal || !ucapanVal || !kehadiranVal) { 
        alert("Mohon lengkapi semua form RSVP terlebih dahulu!"); 
        return; 
    }

    // Cek Spam Filter & Keamanan
    if (isSpamFilterOn) {
        if(localStorage.getItem(`rsvp_${brideId}`)) { 
            alert("Terima Kasih! Anda sudah mengirimkan RSVP/Ucapan sebelumnya."); 
            return; 
        }
        
        const badWords = ['anjing', 'babi', 'monyet', 'bangsat', 'kontol', 'memek', 'jembut', 'goblok', 'tolol', 'ngentot', 'fuck', 'shit', 'bitch'];
        const urlRegex = /(https?:\/\/|www\.)[a-zA-Z0-9\-\.\+\/?\=\&#]+/gi;
        const ucapanLower = ucapanVal.toLowerCase();
        
        if(badWords.some(word => ucapanLower.includes(word)) || urlRegex.test(ucapanVal)) { 
            alert("Peringatan: Ucapan tidak dapat dikirim karena mengandung tautan/link atau kata-kata yang tidak pantas."); 
            return; 
        }
    }

    const textAwal = btnKirim.innerHTML; 
    btnKirim.innerHTML = 'Mengirim...'; 
    btnKirim.disabled = true; btnKirim.style.opacity = '0.7';

    try {
        const masterCollection = collection(db, 'rsvps');
        await addDoc(masterCollection, { brideId: brideId, nama: namaVal, ucapan: ucapanVal, kehadiran: kehadiranVal, timestamp: serverTimestamp() });
        
        // Simpan memori jika sukses (Anti-Spam)
        if(isSpamFilterOn) localStorage.setItem(`rsvp_${brideId}`, 'true');

        inputNama.value = ''; inputUcapan.value = ''; inputKehadiran.value = '';
        btnKirim.innerHTML = 'Terkirim ✓'; 
        btnKirim.style.background = '#2ecc71';
        
    } catch (error) { 
        console.error("Gagal mengirim:", error); alert("Error Firebase, periksa konsol."); 
    } finally { 
        setTimeout(() => { btnKirim.innerHTML = textAwal; btnKirim.disabled = false; btnKirim.style.opacity = '1'; btnKirim.style.background = 'var(--primary)'; }, 3000); 
    }
};