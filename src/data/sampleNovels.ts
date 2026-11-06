import { Novel } from '../types/novel';

export const SAMPLE_NOVELS: Novel[] = [
  {
    id: 'novel-pride-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Klasik',
    description: 'Sebuah mahakarya sastra klasik yang mengisahkan dinamika hubungan cinta, prasangka sosial, dan kebanggaan antara Elizabeth Bennet yang cerdas dan mandiri dengan Tuan Darcy yang kaya raya namun tampak angkuh di pedesaan Inggris abad ke-19.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    totalPages: 38,
    currentPage: 12,
    lastReadAt: '2026-11-04T14:20:00.000Z',
    isFavorite: true,
    rating: 5,
    publishedYear: 1813,
    language: 'id',
    readTimeMinutes: 360,
    tags: ['Klasik', 'Romansa', 'Sastra Inggris', 'Aristokrasi'],
    createdAt: '2026-10-01T08:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Kedatangan Tuan Bingley',
        page: 1,
        content: `Adalah kebenaran yang diakui secara universal bahwa seorang pria lajang yang memiliki kekayaan melimpah pastilah membutuhkan seorang istri.

Betapapun sedikitnya perasaan atau pandangan pria semacam itu saat pertama kali menginjakkan kaki di sebuah lingkungan baru, kebenaran ini begitu tertanam erat dalam benak para tetangganya, sehingga ia segera dianggap sebagai milik sah dari salah satu putri mereka.

"Suamiku tercinta," kata Nyonya Bennet pada suatu pagi kepada suaminya, "apakah kau sudah mendengar bahwa Netherfield Park akhirnya disewakan?"

Tuan Bennet menjawab bahwa ia belum pernah mendengarnya.

"Tapi memang benar," balas sang istri; "Nyonya Long baru saja dari sana dan menceritakan segalanya padaku."

Tuan Bennet tidak menjawab sepatah kata pun.

"Tidakkah kau ingin tahu siapa yang menyewanya?" seru istrinya dengan tidak sabar.

"Kau ingin sekali memberitahuku, dan aku tidak berkeberatan mendengarkannya."

Undangan itu sudah lebih dari cukup.`
      },
      {
        id: 'c2',
        title: 'Bab II: Kunjungan Pertama Tuan Bennet',
        page: 2,
        content: `Tuan Bennet termasuk orang pertama yang mengunjungi Tuan Bingley. Sejak awal ia memang berniat melakukannya, meskipun hingga saat terakhir ia selalu meyakinkan istrinya bahwa ia tidak akan pergi; dan baru pada malam setelah kunjungan itu dilakukan, rahasia tersebut terungkap.

Cara terungkapnya adalah sebagai berikut. Mengamati putri keduanya, Elizabeth, yang sedang sibuk menghias topi, ia tiba-tiba berkata:

"Kuharap Tuan Bingley akan menyukainya, Lizzy."

"Kita tak punya peluang untuk mengetahui apa yang disukai Tuan Bingley," sergah ibunya dengan kesal, "karena kita tidak akan mengunjunginya."

"Tapi Ibu lupa," ujar Elizabeth, "bahwa kita akan bertemu dengannya di pesta dansa majelis, dan Nyonya Long telah berjanji memperkenalkannya kepada kita."

"Aku tidak percaya Nyonya Long mau melakukannya. Dia punya dua keponakan perempuan sendiri. Dia wanita yang egois dan munafik, dan aku tidak menaruh rasa hormat sedikit pun padanya."

"Begitu pula aku," kata Tuan Bennet; "dan aku senang mendapati bahwa kau tidak bergantung pada kebaikannya."`
      },
      {
        id: 'c3',
        title: 'Bab III: Pesta Dansa di Meryton',
        page: 3,
        content: `Bukan hanya harapan Nyonya Bennet dan kelima putrinya yang tertumpu pada pesta dansa tersebut, melainkan seluruh distrik Meryton.

Tuan Bingley tiba dengan penampilan yang menyenangkan, sikap yang ramah dan bersahabat, serta paras yang tampan. Namun perhatian hadirin segera teralihkan oleh sahabatnya, Tuan Darcy, yang berperawakan tinggi tegap, berwajah aristokratik, dan dikabarkan memiliki penghasilan sepuluh ribu pound setahun!

Para pria menyatakan ia pria yang gagah, para wanita memujinya jauh lebih tampan daripada Tuan Bingley. Akan tetapi, menjelang pertengahan malam, kekaguman itu berubah drastis menjadi cemoohan. Sikapnya yang dingin, dingin, dan sombong membuat seluruh ruangan merasa direndahkan.

"Ia terlalu sombong untuk diajak bicara," bisik Nyonya Bennet. "Bahkan ketika Bingley mendesaknya untuk berdansa dengan Lizzy, pria angkuh itu hanya memandang sekilas dan berkata: 'Dia lumayan manis, tapi tidak cukup rupawan untuk menggoyahkan hatiku!' Sungguh lancang!"`
      }
    ],
    contentPages: [
      `Pride and Prejudice - Jane Austen\n\nBab I: Kedatangan Tuan Bingley\n\nAdalah kebenaran yang diakui secara universal bahwa seorang pria lajang yang memiliki kekayaan melimpah pastilah membutuhkan seorang istri.\n\nBetapapun sedikitnya perasaan atau pandangan pria semacam itu saat pertama kali menginjakkan kaki di sebuah lingkungan baru, kebenaran ini begitu tertanam erat dalam benak para tetangganya, sehingga ia segera dianggap sebagai milik sah dari salah satu putri mereka.\n\n"Suamiku tercinta," kata Nyonya Bennet pada suatu pagi kepada suaminya, "apakah kau sudah mendengar bahwa Netherfield Park akhirnya disewakan?"\n\nTuan Bennet menjawab bahwa ia belum pernah mendengarnya.\n\n"Tapi memang benar," balas sang istri; "Nyonya Long baru saja dari sana dan menceritakan segalanya padaku."`,
      `Bab II: Percakapan Keluarga Bennet\n\nKeluarga Bennet tinggal di Longbourn, sebuah kawasan pedesaan yang tenang di Hertfordshire. Dengan lima putri yang belum menikah—Jane, Elizabeth, Mary, Catherine (Kitty), dan Lydia—ambisi terbesar Nyonya Bennet adalah menikahkan mereka semua dengan pria terhormat dan berada.\n\nElizabeth, yang akrab dipanggil Lizzy, adalah anak kedua. Ia mewarisi kecerdasan tajam dan selera humor ayahnya. Berbeda dengan Jane yang selalu memandang kebaikan pada setiap orang, Elizabeth memiliki ketajaman pengamatan yang sering kali membuatnya cepat menilai kepribadian orang lain.`,
      `Bab III: Tatapan Pertama di Pesta Dansa Meryton\n\nLagu waltz mengalun ceria di aula dansa Meryton. Di sudut ruangan, Tuan Darcy berdiri tegak dengan mantel beludru hitamnya yang mewah. Matanya menyapu kerumunan dengan rasa bosan yang tak disembunyikan.\n\n"Ayo Darcy, kau harus berdansa!" bujuk Bingley dengan senyum lebarnya yang hangat. "Lihatlah nona Bennet di sana, dia bidadari yang paling mempesona."\n\n"Kau berdansa dengan satu-satunya gadis cantik di ruangan ini," jawab Darcy dingin. "Sedangkan adik perempuannya yang duduk di belakangmu itu hanya lumayan, tidak cukup rupawan untuk menggoda seleraku."\n\nElizabeth, yang kebetulan berdiri tidak jauh dari mereka, mendengar setiap kata tersebut. Alih-alih tersinggung, bibirnya justru mengulas senyum jenaka yang sarat ironi.`
    ]
  },
  {
    id: 'novel-alice-wonderland',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    genre: 'Fantasi',
    description: 'Petualangan magis seorang gadis cilik bernama Alice yang tergelincir jatuh ke dalam lubang kelinci misterius dan menemukan negeri ajaib yang penuh makhluk unik, teh gila, ratu kejam, dan logika jungkir-balik yang memesona.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    totalPages: 24,
    currentPage: 1,
    lastReadAt: '2026-11-03T09:15:00.000Z',
    isFavorite: true,
    rating: 5,
    publishedYear: 1865,
    language: 'id',
    readTimeMinutes: 180,
    tags: ['Klasik', 'Fantasi', 'Petualangan', 'Dunia Ajaib'],
    createdAt: '2026-10-02T10:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Terjatuh ke Lubang Kelinci',
        page: 1,
        content: `Alice mulai merasa sangat bosan duduk di samping kakak perempuannya di tepi sungai, tanpa ada hal menarik yang bisa dikerjakan. Sekali atau dua kali ia melirik buku yang dibaca kakaknya, namun buku itu tidak memiliki gambar maupun percakapan.

"Dan apa gunanya sebuah buku," pikir Alice, "tanpa gambar atau percakapan?"

Tiba-tiba, seekor Kelinci Putih dengan mata merah muda berlari melintas tepat di dekatnya!

Hal itu sebenarnya tidak terlalu luar biasa; Alice bahkan tidak menganggap aneh ketika mendengar Kelinci itu bergumam sendiri: "Aduh celaka! Aduh celaka! Aku akan terlambat!"

Namun ketika Kelinci itu merogoh saku rompinya dan mengeluarkan sebuah jam saku, melihatnya dengan panik lalu bergegas pergi, Alice terlonjak berdiri! Rasa penasaran membara membakar pikirannya, dan ia segera mengejar kelinci itu melintasi padang rumput hingga terperosok ke dalam lubang kelinci besar di bawah semak belukar.`
      },
      {
        id: 'c2',
        title: 'Bab II: Danau Air Mata',
        page: 2,
        content: `"Semakin aneh dan semakin ganjil!" seru Alice (dia begitu terkejut hingga untuk sejenak ia lupa bagaimana berbicara dalam tata bahasa yang benar). "Sekarang aku merenggang seperti teleskop terbesar yang pernah ada! Selamat tinggal, kaki-kakiku!"

Ketika memandang ke bawah, kakinya tampak begitu jauh hingga hampir tak terlihat lagi. "Oh, kakiku yang malang, siapa yang akan memakaikan sepatu dan kaus kakimu sekarang?"

Tak lama kemudian, Alice mendapati dirinya menangis begitu derasnya hingga air matanya membentuk genangan luas setinggi empat inci di lantai aula marmer yang misterius itu.`
      }
    ],
    contentPages: [
      `Alice's Adventures in Wonderland - Lewis Carroll\n\nBab I: Turun ke Lubang Kelinci\n\nAlice sedang duduk di tepi padang rumput bersama kakaknya yang asyik membaca buku tebal. Semilir angin musim panas membuat kelopak matanya mengantuk.\n\nTiba-tiba saja, seekor kelinci putih melompat dengan rompi satin merah dan jam rantai emas. "Aku terlambat! Aku terlambat!" gumamnya.\n\nAlice membelalakkan mata. Seekor kelinci mengenakan rompi? Dan membawa jam saku? Alice bangkit dan berlari mengejarnya sampai ke sebuah lubang gelap di bawah akar pohon oak tua.`,
      `Bab II: Botol Bertuliskan 'Minum Aku'\n\nDi atas meja kaca kecil berkaki tiga, Alice menemukan sebuah botol kaca indah berleher ramping. Terikat di sekeliling leher botol adalah label kertas bertuliskan huruf-huruf cetak elegan: 'MINUM AKU'.\n\nAlice adalah anak yang waspada. "Aku akan memeriksa dulu apakah ada tanda racun," ujarnya. Namun karena tidak ada tanda bahaya, ia memberanikan diri mencicipinya.\n\nRasanya sungguh lezat—seperti perpaduan pai ceri, puding telur, nanas bakar, kalkun panggang, dan roti panggang bermentega hangat! Dan seketika itu pula, tubuh Alice mulai menyusut hingga hanya setinggi sepuluh inci!`
    ]
  },
  {
    id: 'novel-frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Horor',
    description: 'Kisah legendaris Victor Frankenstein, ilmuwan muda yang terobsesi menaklukkan kematian dengan menciptakan makhluk hidup dari jasad buatan, yang memicu tragedi pilu tentang kemanusiaan, penolakan, dan balas dendam.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    totalPages: 32,
    currentPage: 1,
    lastReadAt: undefined,
    isFavorite: false,
    rating: 5,
    publishedYear: 1818,
    language: 'id',
    readTimeMinutes: 300,
    tags: ['Klasik', 'Fiksi Ilmiah', 'Horor Gotik', 'Filsafat'],
    createdAt: '2026-10-05T11:30:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Malam Percobaan yang Menakutkan',
        page: 1,
        content: `Pada suatu malam yang suram di bulan November, aku menyaksikan penyelesaian jerih payahku. Dengan kecemasan yang hampir menyerupai penderitaan fisik, kukumpulkan instrumen-instrumen kehidupan di sekitarku, agar aku dapat menyalurkan percikan eksistensi ke dalam benda mati yang terbaring kaku di hadapanku.

Waktu menunjukkan pukul satu dini hari; hujan berderak deras menghantam kaca jendela, dan lilinku hampir padam seluruhnya ketika, di tengah kerlip cahaya yang remang-remang, kulihat mata kuning kusam makhluk itu terbuka perlahan.

Ia menarik napas dalam-dalam, dan sebuah gerakan kejang menggetarkan seluruh anggota tubuhnya.

Bagaimana mungkin aku melukiskan emosiku di hadapan malapetaka ini, atau menggambarkan makhluk malang yang telah kuciptakan dengan susah payah dan kelelahan yang tak terkira?`
      }
    ],
    contentPages: [
      `Frankenstein; or, The Modern Prometheus - Mary Shelley\n\nBab I: Percikan Api Kehidupan\n\nVictor Frankenstein muda menatap jasad buatan di atas meja logam laboratoriumnya di Ingolstadt. Angin dingin meniup jendela menara kastil, kilatan petir menyambar di kejauhan.\n\nSelama dua tahun ia tidak pernah tidur teratur, mengabaikan surat-surat dari Elizabeth tunangannya, hanya demi memecahkan misteri terbesar alam semesta: bagaimana menghidupkan kembali daging yang mati.\n\nDan malam itu, jarum galvanometer bergetar. Arus listrik mengalir deras ke urat-urat buatan.`,
      `Bab II: Penyesalan yang Terlambat\n\nMakhluk itu bangkit. Kulitnya yang kekuningan nyaris tidak mampu menutupi otot dan pembuluh darah di bawahnya; rambutnya hitam berkilau dan giginya seputih mutiara, namun kontras itu justru membuat raut wajahnya tampak mengerikan.\n\nVictor mundur ketakutan, menjatuhkan bejana kaca ke lantai batu. Saat tangan raksasa itu terulur padanya seraya mengeluarkan suara erangan lirih yang memohon kasih, Victor berbalik dan melarikan diri ke dalam kegelapan malam.`
    ]
  },
  {
    id: 'novel-tom-sawyer',
    title: 'The Adventures of Tom Sawyer',
    author: 'Mark Twain',
    genre: 'Petualangan',
    description: 'Petualangan seru nan kocak bocah cerdik Tom Sawyer di sepanjang tepian Sungai Mississippi bersama kawan karibnya Huckleberry Finn, dari mengecat pagar hingga mengungkap harta karun bajak laut.',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    totalPages: 28,
    currentPage: 8,
    lastReadAt: '2026-11-02T19:00:00.000Z',
    isFavorite: false,
    rating: 4,
    publishedYear: 1876,
    language: 'id',
    readTimeMinutes: 240,
    tags: ['Klasik', 'Petualangan', 'Humor', 'Masa Kecil'],
    createdAt: '2026-10-07T12:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Pagar Kayu Bibi Polly',
        page: 1,
        content: `"Tom!" Tak ada sahutan.
"Tom!" Masih tak ada sahutan.
"Ke mana perginya anak nakal itu? Hei, Tom!"

Wanita tua itu menarik kacamata ke bawah matanya dan memandang berkeliling ruangan di atas bingkainya.

Pagi itu adalah hari Sabtu yang cerah, udara segar, matahari bersinar keemasan, dan anak-anak lain bebas bermain di sungai. Namun Tom Sawyer dijatuhi hukuman oleh Bibi Polly: mengecat pagar kayu sepanjang tiga puluh yard dengan tinggi sembilan kaki!

Tom menatap ember kapur putihnya dengan helaan napas berat. Tapi Tom adalah anak yang cerdik. Ketika Ben Rogers lewat sambil menirukan suara kapal uap, Tom pura-pura menikmati pekerjaannya dengan gaya seorang seniman agung.

"Hai Ben! Mau mengecat? Mana boleh, Bibi Polly sangat teliti soal pagar ini. Hanya satu dari seribu anak yang punya keahlian seperti ini!"`
      }
    ],
    contentPages: [
      `The Adventures of Tom Sawyer - Mark Twain\n\nBab I: Seni Mengecat Pagar\n\nSabtu pagi datang dengan cerah benderang di St. Petersburg, Missouri. Burung-burung berkicau di dahan pohon apel, dan semua anak lelaki bersiap pergi memancing ke pulau karang.\n\nKecuali Tom. Bibi Polly berdiri di serambi dengan tangan di pinggang, memegang kuas besar dan seember kapur putih.\n\n"Tiga puluh yard pagar ini harus putih berkilau sebelum sore, Tom," kata Bibi Polly tegas.`,
      `Bab II: Muslihat Cerdik Sang Seniman\n\nBen Rogers datang sambil melompat-lompat, menggigit apel merah yang ranum. "Hei Tom, harus kerja ya di hari libur?"\n\nTom menyapu kuasnya dengan anggun, lalu mundur selangkah untuk mengagumi hasil kerjanya. "Kerja? Apakah anak laki-laki bisa mendapat kesempatan mengecat pagar kayu megah setiap hari?"\n\nBen berhenti mengunyah. Matanya terpaku pada kuas Tom. "Bolehkah aku mencoba sedikit, Tom?"\n\nTom menggeleng ragu. "Bibi Polly sangat cemas... Tapi kalau kau berikan separuh apelmu itu, mungkin kupertimbangkan." Sebelum siang berakhir, pagar telah dicat tiga lapis dan kantong Tom penuh kelereng, terompet kuningan, dan serangga hidup!`
    ]
  },
  {
    id: 'novel-secret-garden',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    genre: 'Drama',
    description: 'Kisah mengharukan tentang Mary Lennox, gadis yatim piatu pemarah yang dikirim tinggal di puri terpencil Misselthwaite Manor, Yorkshire, di mana ia menemukan taman terkunci rahasia yang menyembuhkan jiwa.',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    totalPages: 30,
    currentPage: 20,
    lastReadAt: '2026-11-05T18:40:00.000Z',
    isFavorite: true,
    rating: 5,
    publishedYear: 1911,
    language: 'id',
    readTimeMinutes: 270,
    tags: ['Klasik', 'Drama', 'Penyembuhan', 'Alam'],
    createdAt: '2026-10-10T14:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Tak Ada yang Menginginkan Mary',
        page: 1,
        content: `Ketika Mary Lennox dikirim ke Misselthwaite Manor untuk tinggal bersama pamannya, semua orang sepakat bahwa ia adalah anak yang paling berwajah masam dan berperangai buruk yang pernah ada.

Wajahnya kurus kecil, tubuhnya ringkih, rambutnya tipis berwarna kuning jerami, dan ekspresinya selalu merengut masam. Ia dilahirkan di India dan selalu sakit-sakitan.

Namun di puri tua di tengah padang rumput Yorkshire yang berangin kencang, ia mendengar kicau seekor burung robin berbulu merah menyala yang melompat di atas tembok batu berlumut. Dan di bawah tumpukan daun kering, Mary melihat sebuah anak kunci kuno dari kuningan yang berkarat!`
      }
    ],
    contentPages: [
      `The Secret Garden - Frances Hodgson Burnett\n\nBab I: Kunci di Bawah Rerumputan\n\nAngin dingin meniup dedaunan ivy yang merambati tembok batu tinggi. Di Misselthwaite Manor yang sunyi dengan seratus kamar tertutup, Mary berjalan sendirian di kebun luas.\n\nSeekor burung robin kecil hinggap di tangkai pohon apel liar, memiringkan kepalanya seolah memanggil Mary. Mary mendekat perlahan.\n\nDi tempat burung itu mematuk tanah, tanahnya gembur tersapu hujan lebat semalam. Di sana, berkilau sesuatu yang terkubur selama sepuluh tahun: anak kunci kuningan yang berat!`,
      `Bab II: Pintu Hijau Berlumut\n\nDengan jantung berdegup kencang, Mary meraba dedaunan ivy yang menutupi tembok. Di balik juntaian tanaman merambat tebal itu, jari-jarinya menyentuh sebuah kenop pintu besi bundar.\n\nIa memasukkan anak kunci ke lubangnya. Kunci itu berputar dengan bunyi berderit berat. Mary mendorong pintu tersebut, melangkah masuk ke dalam taman rahasia yang telah tertidur lelap selama satu dekade.`
    ]
  },
  {
    id: 'novel-wizard-oz',
    title: 'The Wonderful Wizard of Oz',
    author: 'L. Frank Baum',
    genre: 'Fantasi',
    description: 'Perjalanan Dorothy Gale dan anjingnya Toto yang terhempas angin puting beliung Kansas menuju negeri ajaib Oz, berteman dengan Orang-orangan Sawah, Manusia Kaleng, dan Singa Pengecut mencari jalan pulang.',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    totalPages: 26,
    currentPage: 1,
    lastReadAt: undefined,
    isFavorite: false,
    rating: 4,
    publishedYear: 1900,
    language: 'id',
    readTimeMinutes: 210,
    tags: ['Klasik', 'Fantasi', 'Persahabatan', 'Keberanian'],
    createdAt: '2026-10-12T16:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Angin Puting Beliung Kansas',
        page: 1,
        content: `Dorothy tinggal di tengah-tengah padang rumput Kansas yang luas bersama Paman Henry yang seorang petani, dan Bibi Em, istrinya.

Rumah mereka kecil, hanya terdiri dari satu ruangan dengan dinding kayu bercat kusam yang telah memudar akibat terik matahari dan badai debu.

Tiba-tiba dari arah utara terdengar lolongan angin yang menakutkan, dan dari selatan rumput-rumput bergoyang kencang. Langit berubah menjadi abu-abu gelap.

"Puting beliung datang, Em!" teriak Paman Henry. "Cepat lari ke ruang bawah tanah!"

Dorothy menangkap Toto dan hendak menyusul bibinya, namun rumah mereka tiba-tiba berputar dua atau tiga kali di udara dan terangkat perlahan ke angkasa, melayang di pucuk pusaran angin!`
      }
    ],
    contentPages: [
      `The Wonderful Wizard of Oz - L. Frank Baum\n\nBab I: Mendarat di Negeri Munchkin\n\nRumah kayu kecil itu mendarat dengan guncangan pelan di atas hamparan rumput hijau yang paling indah yang pernah dilihat Dorothy.\n\nBunga-bunga berwarna cerah bermekaran di mana-mana, burung-burung dengan bulu berkilauan bernyanyi merdu di pepohonan lebat. Sekelompok orang bertubuh mungil dengan topi runcing bundar dan mantel biru melangkah menyambutnya dengan bungkukan takzim.\n\n"Selamat datang, wahai Penyihir Agung, di negeri Munchkin!"`,
      `Bab II: Jalan Batu Bata Kuning\n\n"Bagaimana aku bisa kembali ke Kansas kepada Paman Henry dan Bibi Em?" tanya Dorothy dengan cemas.\n\nWanita tua penyihir utara yang baik hati tersenyum lembut. "Kau harus pergi ke Kota Zamrud dan menemui Sang Penyihir Agung Oz. Cukup ikuti jalan yang dilapisi batu bata kuning cerah ini, dan jangan pernah melepaskan sepatu perakmu!"`
    ]
  },
  {
    id: 'novel-lembah-kabut',
    title: 'Lembah Kabut & Rahasia Bunga Edelweiss',
    author: 'Rian Pratama',
    genre: 'Petualangan',
    description: 'Sebuah kisah epik fantasi Nusantara berlatar lereng Gunung Merbabu dan hutan purba Dieng. Tiga sahabat menemukan peta kuno peninggalan Kerajaan Mataram Kuno yang menuntun mereka ke Lembah Kabut abadi tempat Bunga Edelweiss Emas bersemayam.',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    totalPages: 45,
    currentPage: 15,
    lastReadAt: '2026-11-05T20:10:00.000Z',
    isFavorite: true,
    rating: 5,
    publishedYear: 2024,
    language: 'id',
    readTimeMinutes: 420,
    tags: ['Fiksi Nusantara', 'Petualangan', 'Misteri Alam', 'Mitologi'],
    createdAt: '2026-10-15T09:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Prasasti Daun Lontar di Pos Pendakian',
        page: 1,
        content: `Kabut tipis turun perlahan menyelimuti perkebunan teh Selo di bawah bayang-bayang tebing Gunung Merbabu. Suhu udara merosot hingga tiga belas derajat celsius saat Bayu, Dania, dan Genta menyesap kopi jahe hangat di pos pendakian terakhir.

"Kakekku mewasiatkan kotak kayu cendana ini sebelum wafat," ujar Bayu sambil meletakkan sebuah kotak berukir sulur flora khas Jawa Kuno. Di dalamnya, terlipat selembar daun lontar berusia ratusan tahun dengan tulisan beraksara Kawi halus.

Dania, mahasiswi arkeologi yang meneliti naskah kuno, menyorotkan senter kecilnya. Jarinya bergetar saat membaca bait pembuka:

'Yen wus sirna hawa nepsu, bukak lawang Lembah Kabut. Ing kono kembang abadi mekar tanpa kena prabawa mangsa.'

"Lembah Kabut itu bukan sekadar mitos warga lokal," bisik Dania penuh kekaguman. "Ini koordinat nyata menuju mata air abadi di punggungan tersembunyi yang tak pernah tercatat di peta topografi modern mana pun!"`
      },
      {
        id: 'c2',
        title: 'Bab 2: Membelah Hutan Lumut Abadi',
        page: 2,
        content: `Pagi buta pukul empat, ketiganya mulai menembus vegetasi lebat. Pohon-pohon cantigi purba berselimut lumut tebal tampak seperti raksasa hijau yang tertidur di tengah hening subuh.

Tiba-tiba, kompas magnetik Genta berputar tak terkendali. Jarum merah berputar liar 360 derajat.

"Anomali geomagnetik," desis Genta sambil memeriksa altimeter. "Ketinggian kita 2.650 mdpl, tapi udara di sini berbau seperti ozon setelah badai petir."

Di hadapan mereka, rekahan jurang yang tertutup kabut tebal perlahan tersibak angin kencang, menampakkan undakan batu andesit bertingkat sembilan yang tertata rapi melingkari sebuah ngarai hijau zamrud yang sunyi.`
      }
    ],
    contentPages: [
      `Lembah Kabut & Rahasia Bunga Edelweiss - Rian Pratama\n\nBab 1: Wasiat Sang Juru Kunci\n\nDesa Selo masih terlelap saat kabut dingin merayapi genting-genting rumah kayu. Bayu membuka kotak kayu jati peninggalan kakek buyutnya.\n\nDi dalamnya terbaring kompas kuningan Belanda dan selembar lontar bertarikh Saka 1324. "Jangan pernah naik ke puncak saat bulan sabit tenggelam," pesan sang kakek terngiang jelas di telinganya.`,
      `Bab 2: Gerbang Batu Menoreh\n\nLangkah kaki ketiga sahabat memecah gemersik daun kering hutan pinus. Udara semakin tipis dan dingin menusuk tulang.\n\nDi hadapan mereka, dua tebing batu kembar berdiri menjulang laksana candi bentar alamiah. Dari celahnya, aroma wangi edelweiss liar menguar begitu pekat, mengisyaratkan bahwa Lembah Kabut yang legendaris itu benar-benar ada di depan mata.`
    ]
  },
  {
    id: 'novel-catatan-hujan',
    title: 'Catatan Hujan di Kota Tua',
    author: 'Seno Adiwangsa',
    genre: 'Romansa',
    description: 'Sebuah novel romansa sejarah yang puitis dan memikat, menelusuri jejak buku harian misterius tahun 1952 yang ditemukan di sebuah toko buku antik di kawasan Kota Tua Batavia, menghubungkan masa lalu dengan takdir masa kini.',
    coverUrl: 'https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?auto=format&fit=crop&w=600&q=80',
    totalPages: 36,
    currentPage: 36,
    lastReadAt: '2026-11-01T21:15:00.000Z',
    isFavorite: true,
    rating: 5,
    publishedYear: 2023,
    language: 'id',
    readTimeMinutes: 320,
    tags: ['Fiksi Indonesia', 'Romansa', 'Sejarah', 'Kota Tua'],
    createdAt: '2026-10-18T10:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab I: Toko Buku Menjelang Maghrib',
        page: 1,
        content: `Hujan senja selalu memiliki aroma yang sama di Jalan Pintu Besar Utara: perpaduan aspal basah, lumut pada dinding bata merah peninggalan kolonial, dan wangi seduhan kopi tubruk dari kedai seberang jalan.

Farhan meneduh di emperan Toko Buku 'Lestari', sebuah bangunan berdinding tinggi dengan jendela krepyak kayu jati yang sebagian catnya telah mengelupas anggun.

Lonceng perunggu berdenting pelan saat pintu kaca didorong. Di sudut terdalam rak sastra lawas, terselip sebuah buku catatan kecil bersampul linen hijau sage dengan jilidan benang rami.

Pada halaman pertamanya, tertulis tinta pena celup berwarna biru tua bertitimangsa 12 Oktober 1952:

'Jika suatu hari kau membaca lembar ini saat gerimis turun di Batavia, ketahuilah bahwa rindu adalah satu-satunya hal yang tidak pernah lapuk dimakan usia.'`
      }
    ],
    contentPages: [
      `Catatan Hujan di Kota Tua - Seno Adiwangsa\n\nBab I: Sudut Toko Antik\n\nDerai hujan deras membungkus kawasan Fatahillah dalam selimut nostalgia. Farhan menelusuri lorong-lorong sempit berbau kertas tua dan aroma vanili khas buku-buku berumur setengah abad.\n\nSebuah buku bersampul kain sage dengan pita pembatas sutra cokelat menarik jemarinya. Buku itu tidak memiliki label harga, hanya sebuah nama di halaman belakang: Ratna Juwita, 1952.`,
      `Bab II: Surat yang Terlambat Setengah Abad\n\nSetiap bait dalam buku catatan itu melukiskan kisah cinta yang terhalang gelombang pergolakan politik pascakemerdekaan. Seorang pemuda pemain biola orkes radio dan seorang putri saudagar teh Sunda.\n\nFarhan tersentak saat melihat sketsa pensil di halaman kelima belas: sebuah jendela loteng yang bentuk ukirannya persis sama dengan jendela kamar kontrakannya sekarang!`
    ]
  },
  {
    id: 'novel-anggrek-hitam',
    title: 'Misteri Paviliun Anggrek Hitam',
    author: 'Dian Maharani',
    genre: 'Misteri',
    description: 'Sebuah novel misteri detektif berbalut teka-teki ruang tertutup di vila peristirahatan keluarga konglomerat di Kaliurang. Inspektur Arya Danudirja membedah alibi dan dendam lama di balik kematian misterius sang kolektor anggrek langka.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    totalPages: 40,
    currentPage: 4,
    lastReadAt: '2026-11-04T22:30:00.000Z',
    isFavorite: false,
    rating: 4,
    publishedYear: 2025,
    language: 'id',
    readTimeMinutes: 380,
    tags: ['Misteri', 'Detektif', 'Whodunit', 'Teka-Teki'],
    createdAt: '2026-10-20T11:00:00.000Z',
    isCustom: false,
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Dentang Jam Dinding Jam Dua Pagi',
        page: 1,
        content: `Malam itu kabut lereng Merapi begitu tebal hingga lampu-lampu taman Paviliun Anggrek Hitam hanya tampak seperti pendar redup kunang-kunang di kejauhan.

Pukul dua dini hari tepat, jeritan pembantu rumah tangga memecah keheningan vila seluas dua hektar itu.

Raden Mas Suryo Pranoto ditemukan terkulai di atas kursi goyang kulitnya di dalam rumah kaca paviliun anggrek. Pintu rumah kaca terkunci rapat dari dalam menggunakan palang besi kuno, dan kuncinya ditemukan di saku mantel almarhum sendiri.

Tak ada jejak kaki di tanah basah, tak ada kaca jendela yang pecah. Hanya sepucuk kelopak Anggrek Hitam Papua yang masih segar diletakkan dengan presisi tinggi di atas cangkir teh porselen yang belum tandas.`
      }
    ],
    contentPages: [
      `Misteri Paviliun Anggrek Hitam - Dian Maharani\n\nBab 1: Kematian di Rumah Kaca\n\nInspektur Arya menyalakan senter inspeksinya. Udara di dalam rumah kaca terasa lembap dan hangat, sarat aroma pupuk lumut dan humus hutan basah.\n\nDi sekelilingnya, ratusan spesies anggrek langka bergantungan seperti hiasan permata hidup. Raden Mas Suryo tampak tenang, seolah hanya terlelap setelah membaca surat wasiatnya yang tergeletak di meja.\n\nNamun Arya tahu, racun yang bekerja cepat itu tidak meninggalkan jejak rasa pada teh earl grey kesukaan korban.`,
      `Bab 2: Enam Orang yang Punya Kunci Rahasia\n\nEnam anggota keluarga duduk membeku di ruang tamu berpanel kayu jati. Masing-masing menyimpan rahasia, masing-masing memiliki motif warisan bernilai triliunan rupiah.\n\nArya melipat tangannya dan menatap mereka satu per satu. "Tuan-tuan dan Nyonya-nyonya, orang yang membunuh Raden Mas Suryo tidak datang dari luar gerbang vila ini. Pembunuhnya sedang duduk di ruangan ini sekarang."`
    ]
  }
];
