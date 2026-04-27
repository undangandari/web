// Daftar semua input yang mungkin digunakan oleh berbagai acara
const KAMUS_INPUT = {
    "tamu": { label: "Nama Tamu", placeholder: "Contoh: Pak Kepala Desa", type: "dropdown_custom_tamu", opsi: ["", "Pak Kepala Desa", "Custom (isi sendiri)"] },
    
    // Khusus Acara Wedding:
    "acara": { label: "Nama Acara", type: "dropdown_custom", opsi: ["Pernikahan", "Ngunduh Mantu", "The Wedding of", "Resepsi Pernikahan", "Custom (isi sendiri)"] },
    
    "pendek": { label: "Nama Panggilan", placeholder: "Contoh: Lely & Wedi", type: "text" },
    "slug": { label: "URL Slug Undangan", placeholder: "Contoh: lely-dan-wedi", type: "text" },
    "domain": { label: "Domain Provider", type: "dropdown", opsi: ["dwigital.com", "web.undangandari.com"] },
    "pihak1": { label: "Nama Panjang Mempelai 1 & 2", placeholder: "Contoh: Nurlely Rahmadani, S.Pd.,", type: "text" },
    "pihak2": { label: "Nama Panjang Pihak 2", placeholder: "Contoh: Sarwedi Manullang", type: "text" },
    "namaAnak": { label: "Nama Anak", placeholder: "Contoh: Budi Santoso", type: "text" },
    "pendekAnak": { label: "Nama Panggilan Anak", placeholder: "Contoh: Budi", type: "text" },
    "namaOrtu": { label: "Nama Orang Tua", placeholder: "Contoh: Bapak Andi & Ibu Ani", type: "text" }
};
// Database Master: Berisi teks undangan per kategori.
// Cukup edit teks di dalam backtick (`) jika ada revisi.
const DATABASE_TEMPLATE = {
    
    "Wedding": {
        kolomInput: ["acara", "pendek", "slug", "pihak1", "pihak2", "domain", "tamu"],
        templateSalam: {
            "Muslim": `Assalamualaikum, Wr. Wb.\n\nDengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nagar kiranya dapat hadir dalam acara:\n\n===============\n💕 *[acara] [pendek]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\n\nWassalamualaikum Wr. Wb.\n\nKami yang berbahagia,\n_[pihak1]_\n& _[pihak2]_`,
            
            "Kristen": `Shalom, Salam Sejahtera Bagi Kita Semua.\n\nYth. Bapak/Ibu/Saudara/i\n*[tamu]*\ndi Tempat\n\nDengan penuh sukacita dan berlandaskan kasih, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara:\n\n===============\n💕 *[acara] [pendek]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\nTerima kasih, Tuhan Yesus Memberkati.\n\nKami yang berbahagia,\n_[pihak1]_\n& _[pihak2]_`,
            
            "Hindu": `Yth. Bapak/Ibu/Saudara/i\n*[tamu]*\ndi Tempat\n\nOm Swastiastu\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara:\n\n===============\n💕 *[acara] [pendek]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\nTerima kasih.\n\nOm Shanti, Shanti, Shanti, Om.\n\nKami yang berbahagia,\n_[pihak1]_\n& _[pihak2]_`,

            "Formal": `Dengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i\n*[tamu]*\nagar kiranya dapat hadir dalam acara:\n\n===============\n💕 *[acara] [pendek]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\n\nKami yang berbahagia,\n_[pihak1]_\n& _[pihak2]_`,

            "English": `Dear\n*[tamu]*\n\nWith joyful hearts, we cordially invite you to share in our happiness at the celebration of:\n\n===============\n💕 *[acara] [pendek]* 💕\n===============\n\nFor more complete information about the event, please access this digital invitation link: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nIt would be a great joy and honor for us if you could attend and give your blessings.\nThank you.\n\nWarm regards,\n_[pihak1]_\n& _[pihak2]_`,

            "Custom": `[Ketik salam pembuka di sini]\n\nKami mengundang:\n*[tamu]*\n\nUntuk hadir pada:\n*[acara] [pendek]*\n\nLink undangan:\nhttps://[domain]/[slug]?to=[tamu_url]\n\n[Ketik salam penutup di sini]\n\n[pihak1]\n& [pihak2]`
        }
    },

"Acara Anak": {
        // Kolom Input Acara Anak (TANPA nama pendekAnak)
        kolomInput: ["namaAnak", "namaOrtu", "slug", "domain", "tamu"],
        templateSalam: {
            "Khitan": `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran Khitan [namaAnak]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[namaOrtu]`,
            
            "Aqiqah": `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran Aqiqah [namaAnak]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[namaOrtu]`,

		"Tasyakuran": `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran [namaAnak]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[namaOrtu]`,
            
            "Nelu Bulanin (Hindu)": `Yth. Bapak/Ibu/Saudara/i\n*[tamu]*\ndi Tempat\n\nOm Swastiastu\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada:\n\n*Upacara Nelu Bulanin [namaAnak]*\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa untuk anak kami.\nTerima kasih.\n\nOm Shanti, Shanti, Shanti, Om.\n\nKami yang berbahagia,\n_[namaOrtu]_`,
        }
    },
"Birthday": {
        // Kolom Input Birthday (DENGAN pendekAnak)
        kolomInput: ["namaAnak", "pendekAnak", "namaOrtu", "slug", "domain", "tamu"],
        templateSalam: {
                              
            "Ultah Anak": `Halo teman semuanya! 👋👋\n\nTidak terasa sebentar lagi [pendekAnak] akan berulang Tahun lohh 🎈🎉. \nUntuk merayakan hari bahagia ini, [pendekAnak] ingin mengundang Om, Tante, Keluarga, dan Teman-teman semua, untuk hadir dan bersama-sama merayakan acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nCek tanggal & waktu selengkapnya di undangan digital [pendekAnak] ini ya: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nDoain juga semoga [pendekAnak] tambah pintar, sehat, dan makin sayang sama keluarga 🤗.\n\nDitunggu kehadirannya ya!\n\nSalam manis,\n[namaAnak]`,
        
        "Ultah Anak Islami Formal": `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[namaOrtu]`,

            
            "Ultah Anak Kristen Formal": `Shalom, Salam Sejahtera Bagi Kita Semua.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\nhttps://[domain]/[slug]?to=[tamu_url]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nTerima Kasih, Tuhan Yesus Memberkati\n\nOrangtua yang berbahagia,\n[namaOrtu]`,

        }
    },
    // Jangan lupa pastikan ada koma penutup dari blok "Acara Anak" sebelumnya

    "Acara Formal": { kolomInput: ["tamu"], templateSalam: { "Default": `Template Acara Formal belum dibuat` } },
    "Teen & Party": { kolomInput: ["tamu"], templateSalam: { "Default": `Template Teen & Party belum dibuat` } },
    "Acara Lainnya": { kolomInput: ["tamu"], templateSalam: { "Default": `Template Acara Lainnya belum dibuat` } }
};