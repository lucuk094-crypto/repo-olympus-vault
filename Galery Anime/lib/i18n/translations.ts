export type Language = "id" | "zh" | "en" | "ja"

export interface Translations {
  [key: string]: {
    [lang in Language]: string
  }
}

export const translations: Translations = {
  // General
  enter: {
    id: "Masuk",
    zh: "进入",
    en: "Enter",
    ja: "入る",
  },
  backToHome: {
    id: "Kembali ke Beranda",
    zh: "返回首页",
    en: "Back to Home",
    ja: "ホームに戻る",
  },
  loading: {
    id: "Memuat...",
    zh: "加载中...",
    en: "Loading...",
    ja: "読み込み中...",
  },

  // Home page
  siteTitle: {
    id: "Koleksi Anime",
    zh: "二次元收藏馆",
    en: "Anime Collection",
    ja: "アニメコレクション",
  },
  exploreAnimeWorld: {
    id: "Jelajahi dunia anime yang menakjubkan",
    zh: "探索精彩的动漫世界",
    en: "Explore the wonderful world of anime",
    ja: "素晴らしいアニメの世界を探索しよう",
  },
  exploreCategories: {
    id: "Jelajahi Kategori",
    zh: "探索分类",
    en: "Explore Categories",
    ja: "カテゴリを探索",
  },

  // Menu items
  menuAction: {
    id: "Action",
    zh: "动作",
    en: "Action",
    ja: "アクション",
  },
  menuComedy: {
    id: "Comedy",
    zh: "喜剧",
    en: "Comedy",
    ja: "コメディ",
  },
  menuDrama: {
    id: "Drama",
    zh: "剧情",
    en: "Drama",
    ja: "ドラマ",
  },
  menuFantasy: {
    id: "Fantasy",
    zh: "奇幻",
    en: "Fantasy",
    ja: "ファンタジー",
  },
  menuRomance: {
    id: "Romance",
    zh: "恋爱",
    en: "Romance",
    ja: "ロマンス",
  },
  menuVideos: {
    id: "Video",
    zh: "视频",
    en: "Videos",
    ja: "動画",
  },
  menuAbout: {
    id: "Tentang",
    zh: "关于",
    en: "About",
    ja: "概要",
  },

  // Videos page
  videosCollection: {
    id: "Koleksi Video",
    zh: "视频集",
    en: "Videos Collection",
    ja: "動画コレクション",
  },

  // About page
  aboutTitle: {
    id: "Tentang Koleksi Anime",
    zh: "关于二次元收藏馆",
    en: "About Anime Collection",
    ja: "アニメコレクションについて",
  },
  aboutSubtitle: {
    id: "Jelajahi pesona tak terbatas dari anime",
    zh: "探索动漫的无限魅力",
    en: "Explore the infinite charm of anime",
    ja: "アニメの無限の魅力を探索しよう",
  },
  aboutText1: {
    id: "Selamat datang di Koleksi Anime, website koleksi pribadi yang dirancang untuk para penggemar anime. Di sini, Anda dapat menjelajahi gambar dan video anime pilihan dari AniList dan menyelami dunia anime yang menakjubkan.",
    zh: "欢迎来到二次元收藏馆，这是一个专为动漫爱好者打造的个人收藏网站。在这里，你可以探索来自AniList的精选动漫图片和视频，沉浸在二次元的奇妙世界中。",
    en: "Welcome to Anime Collection, a personal collection website designed for anime enthusiasts. Here, you can explore selected anime images and videos from AniList and immerse yourself in the wonderful world of anime.",
    ja: "アニメコレクションへようこそ。これはアニメ愛好家のために作られた個人コレクションサイトです。ここでは、AniListから厳選されたアニメ画像や動画を探索し、アニメの素晴らしい世界に浸ることができます。",
  },
  aboutText2: {
    id: "Koleksi kami mencakup berbagai jenis karya anime, dari manga shounen populer hingga karya independen yang unik. Setiap gambar dan video telah dipilih dengan cermat untuk menampilkan keragaman dan keindahan seni anime.",
    zh: "我们的收藏包含了各种类型的动漫作品，从热门的少年漫画到小众的独立作品，应有尽有。每一张图片和每一段视频都经过精心挑选，以展示动漫艺术的多样性和美感。",
    en: "Our collection includes various types of anime works, from popular shounen manga to niche independent works. Each image and video has been carefully selected to showcase the diversity and beauty of anime art.",
    ja: "私たちのコレクションには、人気の少年漫画からニッチな独立作品まで、さまざまな種類のアニメ作品が含まれています。それぞれの画像と動画は、アニメアートの多様性と美しさを示すために慎重に選ばれています。",
  },
  aboutText3: {
    id: "Selain kenikmatan visual, kami menyediakan elemen interaktif seperti efek cuaca dan karakter Live2D untuk membuat pengalaman browsing Anda lebih hidup dan menarik. Baik Anda penggemar anime berpengalaman atau pendatang baru yang baru mulai menjelajahi dunia anime, ada konten untuk Anda di sini.",
    zh: "除了视觉享受，我们还提供了互动元素，如天气特效和Live2D角色，让你的浏览体验更加生动有趣。无论你是资深的动漫迷还是刚刚开始探索二次元世界的新人，这里都有适合你的内容。",
    en: "In addition to visual enjoyment, we also provide interactive elements such as weather effects and Live2D characters to make your browsing experience more vivid and interesting. Whether you are a seasoned anime fan or a newcomer just starting to explore the world of anime, there is content here for you.",
    ja: "視覚的な楽しみに加えて、天気効果やLive2Dキャラクターなどのインタラクティブな要素も提供し、ブラウジング体験をより鮮やかで面白いものにしています。あなたがベテランのアニメファンであれ、アニメの世界を探索し始めたばかりの新参者であれ、ここにはあなたに合ったコンテンツがあります。",
  },
  totalAnime: {
    id: "Koleksi Anime",
    zh: "收藏动漫",
    en: "Anime Collection",
    ja: "アニメコレクション",
  },
  totalGenres: {
    id: "Kategori",
    zh: "分类类型",
    en: "Categories",
    ja: "カテゴリ",
  },
  totalVideos: {
    id: "Video",
    zh: "视频数量",
    en: "Videos",
    ja: "動画数",
  },
}

export function getTranslation(key: string, lang: Language): string {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`)
    return key
  }
  return translations[key][lang] || translations[key]["id"]
}
