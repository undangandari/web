// file: js/utils/utils-datetime.js

window.UtilsTime = window.UtilsTime || {};

/**
 * 1. PENGONVERSI FORMAT TANGGAL
 * Mengubah string tanggal dari <input type="datetime-local"> menjadi format Bahasa Indonesia
 */
window.UtilsTime.parseDateTime = function(dtString) {
    // Revisi: Mengubah fallback default dari 'BULAN TAHUN' menjadi 'BULAN' saja
    if (!dtString) return { hari: 'Hari', tgl: '00', bulan: 'BULAN', tahun: 'Tahun', waktu: '00:00', raw: 0 };
    const dateObj = new Date(dtString);
    if (isNaN(dateObj)) return { hari: 'Hari', tgl: '00', bulan: 'BULAN', tahun: 'Tahun', waktu: '00:00', raw: 0 };

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return {
        hari: days[dateObj.getDay()],
        tgl: String(dateObj.getDate()).padStart(2, '0'),
        
        // === REVISI UTAMA: Hapus dateObj.getFullYear() agar hanya merender nama bulan ===
        bulan: months[dateObj.getMonth()],
        
        tahun: dateObj.getFullYear(),
        waktu: `${String(dateObj.getHours()).padStart(2, '0')}.${String(dateObj.getMinutes()).padStart(2, '0')} WIB`,
        raw: dateObj.getTime()
    };
};
/**
 * 2. PENGHITUNG WAKTU MUNDUR (COUNTDOWN) MULTI-TARGET
 * Menerima array berisi objek target: [{ prefix: 'akad', date: 12345... }, { prefix: 'resepsi', date: 12345... }]
 */
window.UtilsTime.countdownInterval = null; 

window.UtilsTime.startCountdown = function(targetArray) {
    if(window.UtilsTime.countdownInterval) {
        clearInterval(window.UtilsTime.countdownInterval);
    }
    
    if (!targetArray || !Array.isArray(targetArray) || targetArray.length === 0) return;

    window.UtilsTime.countdownInterval = setInterval(function() {
        const now = new Date().getTime();

        targetArray.forEach(target => {
            if (!target.date || isNaN(target.date)) return;
            const distance = target.date - now;

            let days = 0, hours = 0, minutes = 0, seconds = 0;

            if (distance > 0) {
                days = Math.floor(distance / (1000 * 60 * 60 * 24)); 
                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); 
                seconds = Math.floor((distance % (1000 * 60)) / 1000);
            }

            const strDays = days < 10 ? "0" + days : days;
            const strHours = hours < 10 ? "0" + hours : hours;
            const strMinutes = minutes < 10 ? "0" + minutes : minutes;
            const strSeconds = seconds < 10 ? "0" + seconds : seconds;

            const elDay = document.getElementById(`${target.prefix}-day`);
            if (elDay) {
                elDay.innerText = strDays; 
                document.getElementById(`${target.prefix}-hour`).innerText = strHours; 
                document.getElementById(`${target.prefix}-minute`).innerText = strMinutes; 
                document.getElementById(`${target.prefix}-second`).innerText = strSeconds;
            }
        });
    }, 1000);
};


/**
 * 3. PEMBUAT LINK GOOGLE CALENDAR
 * Menghasilkan URL otomatis berdasarkan parameter acara
 */
window.UtilsTime.generateCalendarLink = function(dtString, title, location, description) {
    if (!dtString) return '#';
    
    const startDate = new Date(dtString);
    if (isNaN(startDate)) return '#';

    // Set durasi acara (Default kita asumsikan 2 jam = 2 * 60 * 60 * 1000 milidetik)
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

    // Google Calendar mewajibkan format waktu dalam UTC: YYYYMMDDTHHMMSSZ
    const formatToUTC = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, ''); 
    };

    const startUTC = formatToUTC(startDate);
    const endUTC = formatToUTC(endDate);

    // Menyusun parameter URL (menggunakan URLSearchParams agar aman dari spasi & karakter khusus)
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', title || 'Acara Pernikahan');
    url.searchParams.append('dates', `${startUTC}/${endUTC}`);
    
    if (location) url.searchParams.append('location', location);
    if (description) url.searchParams.append('details', description);

    return url.toString();
};