/**
 * ============================================================================
 * MASTER DATA UNDANGAN DIGITAL
 * File ini adalah "Otak Konfigurasi" aplikasi Anda.
 * Mengatur UI Kategori, Dropdown, Teks Chat, hingga Logika Pembacaan URL Parameter.
 * ============================================================================
 */

const APP_DATA = {
    // ==========================================
    // 1. DAFTAR KATEGORI TAB UTAMA
    // ==========================================
    categories: [
        { id: 'wedding', label: 'Wedding', icon: 'fa-solid fa-rings-wedding', status: 'active' },
        { id: 'anak', label: 'Acara Anak', icon: 'fa-solid fa-child-reaching', status: 'active' },
        { id: 'birthday', label: 'Birthday', icon: 'fa-solid fa-cake-candles', status: 'active' },
        { id: 'divider', type: 'divider' }, // Pemisah garis vertikal
        { id: 'teen', label: 'Teen', status: 'soon' },
        { id: 'formal', label: 'Formal', status: 'soon' },
        { id: 'lainnya', label: 'Lainnya', status: 'soon' }
    ],

    // ==========================================
    // 2. OPSI DROPDOWN & TEMPLATE
    // ==========================================
    acaraWedding: [
        { value: 'Pernikahan', label: 'Pernikahan' },
        { value: 'Ngunduh Mantu', label: 'Ngunduh Mantu' },
        { value: 'The Wedding of', label: 'The Wedding of' },
        { value: 'Resepsi Pernikahan', label: 'Resepsi Pernikahan' },
        { value: 'custom', label: 'Custom (Ketik Sendiri)' }
    ],

    templateOptions: {
        wedding: [
            { value: 'formal', label: 'Wedding - Formal' },
            { value: 'muslim', label: 'Wedding - Muslim' },
            { value: 'kristen', label: 'Wedding - Kristen' },
            { value: 'hindu', label: 'Wedding - Hindu' },
            { value: 'english', label: 'Wedding - English' },
            { value: 'teksundangananda', label: 'Custom Text Undangan' }
        ],
        anak: [
            { value: 'khitan', label: 'Anak - Khitanan' },
            { value: 'aqiqah', label: 'Anak - Aqiqah' },
            { value: 'tasyakuran', label: 'Anak - Tasyakuran' },
            { value: 'nelubulanin', label: 'Anak - Nelu Bulanin (Hindu)' },
            { value: 'teksundangananda', label: 'Custom Text Undangan' }
        ],
        birthday: [
            { value: 'birthday-anak', label: 'Birthday - Anak (Umum)' },
            { value: 'birthday-islami', label: 'Birthday - Islami' },
            { value: 'birthday-kristen', label: 'Birthday - Kristen' },
            { value: 'teksundangananda', label: 'Custom Text Undangan' }
        ]
    },

    templates: {
        // == WEDDING ==
        'formal': `Dengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i\n*[nama-tamu]*\nagar kiranya dapat hadir dalam acara:\n\n===============\n💕 *[acara] [nama-mempelai]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\n\nKami yang berbahagia,\n_[nama-lengkap]_`,
        'muslim': `Assalamualaikum, Wr. Wb.\n\nDengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nagar kiranya dapat hadir dalam acara:\n\n===============\n💕 *[acara] [nama-mempelai]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\n\nWassalamualaikum Wr. Wb.\n\nKami yang berbahagia,\n_[nama-lengkap]_`,
        'kristen': `Shalom, Salam Sejahtera Bagi Kita Semua.\n\nYth. Bapak/Ibu/Saudara/i\n*[nama-tamu]*\ndi Tempat\n\nDengan penuh sukacita dan berlandaskan kasih, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara:\n\n===============\n💕 *[acara] [nama-mempelai]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\nTerima kasih, Tuhan Yesus Memberkati.\n\nKami yang berbahagia,\n_[nama-lengkap]`,
        'hindu': `Yth. Bapak/Ibu/Saudara/i\n*[nama-tamu]*\ndi Tempat\n\nOm Swastiastu\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara:\n\n===============\n💕 *[acara] [nama-mempelai]* 💕\n===============\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa restu.\nTerima kasih.\n\nOm Shanti, Shanti, Shanti, Om.\n\nKami yang berbahagia,\n_[nama-lengkap]`,
        'english': `Dear\n*[nama-tamu]*\n\nWith joyful hearts, we cordially invite you to share in our happiness at the celebration of:\n\n===============\n💕 *[acara] [nama-mempelai]* 💕\n===============\n\nFor more complete information about the event, please access this digital invitation link: 👇👇👇\n\n[link-undangan]\n\nIt would be a great joy and honor for us if you could attend and give your blessings.\nThank you.\n\nWarm regards,\n_[nama-lengkap]`,

        
        // == ANAK ==
        'khitan': `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran Khitan [nama-utama]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[nama-tambahan]`,
        'aqiqah': `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran Aqiqah [nama-utama]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[nama-tambahan]`,
        'tasyakuran': `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*Tasyakuran [nama-utama]*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[nama-tambahan]`,
        'nelubulanin': `Yth. Bapak/Ibu/Saudara/i\n*[nama-tamu]*\ndi Tempat\n\nOm Swastiastu\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada:\n\n*Upacara Nelu Bulanin [nama-utama]*\n\nBerikut link undangan kami, untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan undangan digital berikut: 👇👇👇\n\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\nTerima kasih.\n\nOm Shanti, Shanti, Shanti, Om.\n\nKami yang berbahagia,\n_[nama-tambahan]_`,

        // == BIRTHDAY ==
        'birthday-anak': `Halo teman semuanya! 👋👋\n\nTidak terasa sebentar lagi [nama-panggilan] akan berulang Tahun lohh 🎈🎉. \nUntuk merayakan hari bahagia ini, [nama-panggilan] ingin mengundang Om, Tante, Keluarga, dan Teman-teman semua, untuk hadir dan bersama-sama merayakan acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nCek tanggal & waktu selengkapnya di undangan digital [nama-panggilan] ini ya: 👇👇👇\n[link-undangan]\n\nDoain juga semoga [nama-panggilan] tambah pintar, sehat, dan makin sayang sama keluarga 🤗.\n\nDitunggu kehadirannya ya!\n\nSalam manis,\n[namaAnak]`,
        'birthday-islami': `Assalamualaikum, Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nWassalamualaikum Wr. Wb.\n\nOrangtua yang berbahagia,\n[nama-tambahan]`,
        'birthday-kristen': `Shalom, Salam Sejahtera Bagi Kita Semua.\n\nTanpa mengurangi rasa hormat, perkenankanlah kami mengundang Bapak/Ibu/Saudara/i \n*[nama-tamu]*\nuntuk hadir dan memberikan doa pada acara\n\n===============\n*🎉 Ulang Tahun [namaAnak] 🎂*\n===============\n\nDetail informasi acara dapat dilihat melalui tautan undangan digital berikut: 👇👇👇\n[link-undangan]\n\nMerupakan suatu kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan meringankan langkah untuk hadir maupun memberikan doa.\n\nTerima Kasih, Tuhan Yesus Memberkati\n\nOrangtua yang berbahagia,\n[nama-tambahan]`,

        // == CUSTOM ==
        'teksundangananda': `Silahkan isikan teks undangan yang akan Anda gunakan!`
    },

	// ==========================================
    // 3. KONFIGURASI URL SLUGS & AUTO-FILL
    // ==========================================
    urlConfig: {
        // Alias untuk mendeteksi Tab yang harus dibuka
        tabAliases: {
            'wedding': 'wedding',
            'anak': 'anak',
            'birthday': 'birthday',
        },

        // Konfigurasi acara khusus yang tidak menggunakan dropdown manual
        // Sistem akan mendeteksi dari Template yang dipilih
        acaraKhusus: {
            anak: {
                'khitan': 'Khitanan',
                'aqiqah': 'Aqiqah',
                'tasyakuran': 'Tasyakuran',
                'nelubulanin': 'Nelu Bulanin'
            },
            birthday: {
                default: 'Ulang Tahun'
            }
        },
        
        // Aturan pengisian data otomatis dari URL Parameter ke HTML Input ID
        autoFillMapping: {
            wedding: {
                'wedding-namaMempelaiInput': ['mempelai'],
                'wedding-namaLengkapInput': ['namaLengkap'],
                'wedding-teksPengantar': ['template'],
                // Khusus dropdown acara, kita bisa petakan angka ke teksnya
                'wedding-jenisAcara': { 
                    params: ['acara'], 
                    // Kita samakan map-nya dengan value yang ada di acaraWedding
                    valueMap: {"1": "Pernikahan", "2": "Ngunduh Mantu", "3": "The Wedding of", "4": "Resepsi Pernikahan"} 
                }
            },
            anak: {
                'anak-namaAnakInput': ['anak'],
                'anak-namaOrtuInput': ['ortu'],
                'anak-teksPengantar': ['template']
            },
            birthday: {
                'birthday-namaAnakInput': ['anak'],
                'birthday-namaPanggilanInput': ['panggilan'],
                'birthday-namaOrtuInput': ['ortu'],
                'birthday-teksPengantar': ['template']
            }
        },

        // Aturan Replace Tag di Teks Pengantar
        replaceTags: {
            wedding: {
                '[nama-mempelai]': 'wedding-namaMempelaiInput',
                '[nama-lengkap]': 'wedding-namaLengkapInput'
            },
            anak: {
                '[nama-utama]': 'anak-namaAnakInput',
                '[nama-tambahan]': 'anak-namaOrtuInput'
            },
            birthday: {
                '[nama-lengkap]': 'birthday-namaAnakInput',
                '[nama-panggilan]': 'birthday-namaPanggilanInput',
                '[nama-tambahan]': 'birthday-namaOrtuInput'
            }
        }
    },
    

    // ==========================================
    // 4. TUTORIAL LANGKAH-LANGKAH (LENGKAP 10 LANGKAH)
    // ==========================================
    tutorialSteps: [
        {
            color: 'blue', 
            title: 'Input Nama Tamu',
            desc: 'Masukkan nama tamu yang ingin diundang di <span class="text-blue-300 font-medium">Kolom 1</span>. Kamu bisa memasukkan banyak nama sekaligus dengan <span class="text-white font-medium">menekan Enter</span> untuk setiap nama baru.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom01.png'
        },
        {
            color: 'pink', 
            title: 'Tentukan Nama Utama',
            desc: 'Masukkan nama kamu dan pasangan (atau nama anak sesuai jenis acara) di <span class="text-pink-300 font-medium">Kolom 2</span>.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom02.png'
        },
        {
            color: 'purple', 
            title: 'Pilih Jenis Acara',
            desc: 'Tentukan jenis acara kamu (hanya pada form wedding). Jika acara kamu spesifik, pilih opsi <span class="text-white font-medium">"Custom"</span> dan ketik nama acaranya sendiri.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom03.png'
        },
        {
            color: 'emerald', 
            title: 'Sesuaikan Teks Pengantar',
            desc: 'Pilih template teks pengantar sesuai dengan salam agama yang kamu mau. Kamu juga bisa mengedit template chatnya dengan menyalakan toggle switch <span class="text-white font-medium">"Edit Teks Pengantar"</span>.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom04.png'
        },
        {
            color: 'brand-accent', 
            title: 'Generate Nama Tamu',
            desc: 'Klik tombol <strong class="text-[#4cb5f9]">"Generate Nama Tamu"</strong>. Lalu akan muncul <span class="text-white font-medium">5 tombol aksi</span> untuk mengirim undangan.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom05.png'
        },
        {
            color: 'amber', 
            title: 'Bagikan Undangan',
            desc: 'Klik <strong class="text-amber-300">tombol whatsapp (tombol ke-4)</strong> untuk mengirim undangan kepada <span class="text-white font-medium">masing-masing tamu</span>.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom06.png'
        },
        {
            color: 'orange', 
            title: 'Cari kontak WA Tamu',
            desc: 'Whatsapp akan secara otomatis terbuka, <strong class="text-orange-300">cari kontak WA tamu</strong>. Sebagai contoh, disini saya mencari kontak <span class="bg-orange-500/20 text-orange-200 px-2 py-0.5 rounded font-medium border border-orange-500/30">"Budiono Siregar"</span>',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom07.png'
        },
        {
            color: 'teal', 
            title: 'Preview Undangan',
            desc: '<strong class="text-teal-300">Tunggu sekitar 5 detik</strong> agar foto preview undangan muncul di kolom chat Whatsapp sambil <span class="text-white font-medium">mengecek ulang template chat kamu</span>.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom08.png'
        },
        {
            color: 'green', 
            title: 'Kirim Undangan',
            desc: 'Ketika semua sudah oke, foto preview sudah muncul. Tinggal <strong class="text-green-300">tekan tombol kirim</strong> di Whatsapp.',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom09.png'
        },
        {
            color: 'indigo', 
            title: 'Kirim ke Tamu Selanjutnya',
            desc: '<strong class="text-indigo-300">Lakukan hal yang sama</strong> untuk tamu kedua dan seterusnya. Klik icon WA dan <span class="text-white font-medium">cari kembali kontak WA</span> yang sesuai dengan tamu tersebut',
            img: 'https://ik.imagekit.io/undangandigital/general/kolom10.png'
        }
    ]
};