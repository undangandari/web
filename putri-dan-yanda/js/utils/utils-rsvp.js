// file: js/utils/utils-rsvp.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// REVISI: Tambahkan import 'updateDoc' dan 'doc'
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
// 2. PEMBACAAN SAKLAR DARI PANEL UI (REAL-TIME)
// ==========================================
function isDemoModeActive() {
    const el = document.getElementById('g_ogDemoMode');
    return el ? el.checked : false;
}
function isSpamFilterActive() {
    // True = Spam filter nyala (normal), False = Mati (untuk testing)
    const el = document.getElementById('g_rsvpSpamFilter');
    return el ? el.checked : true; 
}
function isBadwordFilterActive() {
    // True = Badword filter nyala (normal), False = Mati (untuk testing)
    const el = document.getElementById('g_rsvpBadwordFilter');
    return el ? el.checked : true; 
}
// ==========================================

// ==========================================
// 2.5 CUSTOM POPUP & LOGIKA LOCALSTORAGE (NEW)
// ==========================================
function showRsvpPopup(type, title, message) {
    const oldPopup = document.getElementById('custom-rsvp-popup');
    if (oldPopup) oldPopup.remove();

    let icon = ''; let color = '';
    if (type === 'success') { icon = '<i class="fas fa-check"></i>'; color = '#2ecc71'; }
    else if (type === 'error' || type === 'spam') { icon = '<i class="fas fa-times"></i>'; color = '#e74c3c'; }
    else if (type === 'warning' || type === 'demo') { icon = '<i class="fas fa-exclamation-triangle"></i>'; color = '#f39c12'; }

    const popupHTML = `
    <div id="custom-rsvp-popup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
        <div style="background: white; width: 85%; max-width: 320px; border-radius: 24px; padding: 30px 20px; text-align: center; transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 15px 40px rgba(0,0,0,0.2);">
            <div style="width: 65px; height: 65px; background: ${color}15; color: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 15px auto;">
                ${icon}
            </div>
            <h3 style="margin: 0 0 10px 0; color: #333; font-family: 'Segoe UI', sans-serif; font-size: 19px; font-weight: bold;">${title}</h3>
            <p style="margin: 0 0 25px 0; color: #666; font-size: 13.5px; line-height: 1.5; font-family: 'Segoe UI', sans-serif;">${message}</p>
            <button onclick="document.getElementById('custom-rsvp-popup').style.opacity='0'; document.getElementById('custom-rsvp-popup').children[0].style.transform='translateY(20px) scale(0.95)'; setTimeout(() => document.getElementById('custom-rsvp-popup').remove(), 300);" style="background: ${color}; color: white; border: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 15px ${color}40; transition: 0.2s;">Mengerti</button>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    setTimeout(() => {
        const popup = document.getElementById('custom-rsvp-popup');
        if(popup) { popup.style.opacity = '1'; popup.children[0].style.transform = 'translateY(0) scale(1)'; }
    }, 10);
}

function checkRsvpLocalStatus(brideId) {
    if (!isSpamFilterActive()) return null;
    const savedData = localStorage.getItem(`rsvp_data_${brideId}`);
    if (!savedData) return null;

    try {
        const parsed = JSON.parse(savedData);
        const now = new Date().getTime();
        const diffMins = (now - parsed.timestamp) / (1000 * 60); // Hitung selisih dalam menit

        if (diffMins <= 15) return { mode: 'edit', data: parsed };
        else return { mode: 'locked', data: parsed };
    } catch(e) { return null; }
}

// 3. UI KONTROL MODAL (ANIMASI)
// ==========================================
window.bukaModalRSVP = function() {
    const overlay = document.getElementById('modal-rsvp-overlay');
    const card = document.getElementById('modal-rsvp-card');
    const frame = document.querySelector('.frame'); 
    
    if(overlay && card) {
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 10);
    }
    
    if(frame) {
        frame.style.transition = 'opacity 0.4s ease';
        frame.style.opacity = '0'; 
    }

    // --- TAMBAHAN REVISI: LOGIKA AUTO-FILL & EDIT (15 MENIT) ---
    const rawBrideId = document.getElementById('g_brideId') && document.getElementById('g_brideId').value ? document.getElementById('g_brideId').value : 'undangan_baru';
    const brideId = isDemoModeActive() ? 'lisa-dan-palmer' : rawBrideId;
    const localStatus = checkRsvpLocalStatus(brideId);
    
    const btnKirim = document.getElementById('btn-kirim-rsvp');
    const inputNama = document.getElementById('rsvp-nama'); 
    const inputKehadiran = document.getElementById('rsvp-hadir');
    const inputUcapan = document.getElementById('rsvp-pesan');

    const formContainer = document.getElementById('rsvp-form-container');
    const successContainer = document.getElementById('rsvp-success-container');
    const successName = document.getElementById('rsvp-success-name');
    const btnEdit = document.getElementById('btn-edit-rsvp');

    if (localStatus) {
        // SMART RE-OPEN: Jika sudah ada memori, langsung masuk Kotak Sukses (Layar B)
        if (formContainer && successContainer) {
            formContainer.style.display = 'none';
            successContainer.style.display = 'block';
        }
        if (successName) successName.innerText = localStatus.data.nama;
        
        // Isi form diam-diam untuk persiapan jika tombol Edit ditekan
        if(inputNama) inputNama.value = localStatus.data.nama;
        if(inputKehadiran) inputKehadiran.value = localStatus.data.kehadiran;
        if(inputUcapan) inputUcapan.value = localStatus.data.ucapan;
        
        if (localStatus.mode === 'edit') {
            if(btnEdit) btnEdit.style.display = 'inline-block';
            if(btnKirim) { btnKirim.innerHTML = 'PERBARUI UCAPAN'; btnKirim.style.background = '#f39c12'; }
        } else {
            // Mode Locked: Lewat 15 menit, sembunyikan tombol edit
            if(btnEdit) btnEdit.style.display = 'none';
        }
    } else {
        // FORM KOSONG (Layar A)
        if (formContainer && successContainer) {
            formContainer.style.display = 'block';
            formContainer.style.opacity = '1';
            successContainer.style.display = 'none';
        }
        if(inputNama) inputNama.value = '';
        if(inputKehadiran) inputKehadiran.value = '';
        if(inputUcapan) inputUcapan.value = '';
        if(btnKirim) { btnKirim.innerHTML = 'KIRIM	 SEKARANG'; btnKirim.style.background = 'var(--primary)'; }
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
// 3.5 FUNGSI BERALIH KE FORM KOREKSI (VIEW SWITCHING)
// ==========================================
window.editRsvpForm = function() {
    const formContainer = document.getElementById('rsvp-form-container');
    const successContainer = document.getElementById('rsvp-success-container');
    const btnKirim = document.getElementById('btn-kirim-rsvp');
    
    if (formContainer && successContainer) {
        successContainer.style.display = 'none';
        formContainer.style.display = 'block';
        
        // Efek transisi halus saat muncul form kembali
        formContainer.style.opacity = '0';
        setTimeout(() => formContainer.style.opacity = '1', 50);
        
        if(btnKirim) { 
            btnKirim.innerHTML = 'PERBARUI UCAPAN'; 
            btnKirim.style.background = '#f39c12'; 
        }
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
    const rawBrideId = document.getElementById('g_brideId') && document.getElementById('g_brideId').value ? document.getElementById('g_brideId').value : 'undangan_baru';
    const brideId = isDemoModeActive() ? 'lisa-dan-palmer' : rawBrideId;
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
            <div style="background: #fafafa; border: 1px solid #eaeaea; border-radius: 12px; padding: 15px; display: flex; gap: 15px; text-align: left; transition: 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${bgColor}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;">${inisial}</div>
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
// 6. WRITE DATA (KIRIM PESAN & FILTER PINTAR)
// ==========================================
window.kirimRsvpPreview = async function() {
    const rawBrideId = document.getElementById('g_brideId') && document.getElementById('g_brideId').value ? document.getElementById('g_brideId').value : 'undangan_baru';
    const brideId = isDemoModeActive() ? 'lisa-dan-palmer' : rawBrideId;
    
    // 1. CEK MODE DEMO
    if(isDemoModeActive()) {
        showRsvpPopup('demo', 'Mode Demo / Preview', 'Maaf, Anda tidak dapat mengirim ucapan karena ini adalah versi undangan demo/katalog.');
        return;
    }

    const inputNama = document.getElementById('rsvp-nama'); 
    const inputKehadiran = document.getElementById('rsvp-hadir');
    const inputUcapan = document.getElementById('rsvp-pesan');
    const btnKirim = document.getElementById('btn-kirim-rsvp');

    const namaVal = inputNama.value.trim(); 
    const ucapanVal = inputUcapan.value.trim(); 
    const kehadiranVal = inputKehadiran.value;

    if (!namaVal || !ucapanVal || !kehadiranVal) { 
        showRsvpPopup('warning', 'Form Belum Lengkap', 'Mohon lengkapi nama, kehadiran, dan ucapan Anda terlebih dahulu sebelum mengirim.'); 
        return; 
    }

    // 2. CEK SPAM & FILTER KATA
    const localStatus = checkRsvpLocalStatus(brideId);
    
    if (isSpamFilterActive() && localStatus && localStatus.mode === 'locked') {
        showRsvpPopup('spam', 'Batas Waktu Habis', 'Maksimal pengiriman ucapan per tamu adalah 1 kali, dan batas waktu untuk mengedit ucapan (15 menit) telah habis.');
        return;
    }

    if (isBadwordFilterActive()) {
        const badWords = ['anjing', 'babi', 'monyet', 'bangsat', 'kontol', 'memek', 'jembut', 'goblok', 'tolol', 'ngentot', 'fuck', 'shit', 'bitch'];
        const urlRegex = /(https?:\/\/|www\.)[a-zA-Z0-9\-\.\+\/?\=\&#]+/gi;
        const ucapanLower = ucapanVal.toLowerCase();
        
        if(badWords.some(word => ucapanLower.includes(word)) || urlRegex.test(ucapanVal)) { 
            showRsvpPopup('error', 'Peringatan Sistem', 'Ucapan tidak dapat dikirim karena mengandung tautan (link) atau kata-kata yang tidak pantas. Harap perbaiki ucapan Anda.'); 
            return; 
        }
    }

    // 3. PROSES PENGIRIMAN
    const textAwal = btnKirim.innerHTML; 
    btnKirim.innerHTML = 'Memproses...'; 
    btnKirim.disabled = true; btnKirim.style.opacity = '0.7';

    try {
        const masterCollection = collection(db, 'rsvps');
        
        if (isSpamFilterActive() && localStatus && localStatus.mode === 'edit' && localStatus.data.docId) {
            // JALUR A: UPDATE UCAPAN
            const docRef = doc(db, 'rsvps', localStatus.data.docId);
            await updateDoc(docRef, { nama: namaVal, ucapan: ucapanVal, kehadiran: kehadiranVal, updateTimestamp: serverTimestamp() });
            
            const updatedData = { ...localStatus.data, nama: namaVal, ucapan: ucapanVal, kehadiran: kehadiranVal };
            localStorage.setItem(`rsvp_data_${brideId}`, JSON.stringify(updatedData));
        } else {
            // JALUR B: INSERT UCAPAN BARU
            const newDoc = await addDoc(masterCollection, { brideId: brideId, nama: namaVal, ucapan: ucapanVal, kehadiran: kehadiranVal, timestamp: serverTimestamp() });
            
            if(isSpamFilterActive()) {
                const localData = { docId: newDoc.id, timestamp: new Date().getTime(), nama: namaVal, ucapan: ucapanVal, kehadiran: kehadiranVal };
                localStorage.setItem(`rsvp_data_${brideId}`, JSON.stringify(localData));
            }
        }
        
        btnKirim.innerHTML = 'Berhasil ✓'; 
        btnKirim.style.background = '#2ecc71';
        
        // --- REVISI VIEW SWITCHING: Ganti Layar Form Menjadi Layar Sukses ---
        setTimeout(() => {
            const formContainer = document.getElementById('rsvp-form-container');
            const successContainer = document.getElementById('rsvp-success-container');
            const successName = document.getElementById('rsvp-success-name');
            const btnEdit = document.getElementById('btn-edit-rsvp');
            
            if (formContainer && successContainer) {
                formContainer.style.opacity = '0'; // Animasi fade out
                setTimeout(() => {
                    formContainer.style.display = 'none';
                    if(successName) successName.innerText = namaVal; // Nama otomatis dari input tamu
                    successContainer.style.display = 'block';
                    
                    // Sembunyikan tombol edit jika filter Spam/15 menit dimatikan Admin
                    if(btnEdit) btnEdit.style.display = isSpamFilterActive() ? 'inline-block' : 'none';
                    
                    // Kembalikan status tombol ke awal untuk disiapkan bila diklik tombol edit
                    btnKirim.disabled = false; btnKirim.style.opacity = '1';
                    btnKirim.innerHTML = 'PERBARUI UCAPAN'; 
                    btnKirim.style.background = '#f39c12'; 
                }, 300);
            }
        }, 600);
        
    } catch (error) { 
        console.error("Gagal mengirim:", error); 
        
        if (error.code === 'permission-denied') {
            showRsvpPopup('error', 'Akses Ditolak', 'Database Firebase Anda belum mengizinkan fitur Edit/Update data. Silakan perbarui Rules Firebase Anda.');
        } else {
            showRsvpPopup('error', 'Koneksi Gagal', 'Terjadi kesalahan saat menghubungi server. Periksa koneksi internet Anda.');
        }
        
        // Kembalikan form jika gagal saja
        btnKirim.innerHTML = textAwal; 
        btnKirim.disabled = false; btnKirim.style.opacity = '1'; 
    }
};

// === SOLUSI ASYNC TIMING: Paksa jalankan listener begitu modul siap terpasang ===
setTimeout(() => {
    if (window.initFirebaseRSVP) window.initFirebaseRSVP();
}, 200);
