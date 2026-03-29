// p-book pro děti — Jak fungují doporučování

export const CONFIG = {
  book: {
    title: 'Jak funguje doporučování online?',
    author: 'Pavel Kordík',
    contentDir: 'content',
    bookIndex: 'content/book.json'
  },

  recombee: {
    enabled: true,
    database: 'cvachond-land-free-pbook-kids',
    scenarios: {
      homepagePersonal: 'homepage-personal',
      homepageVoice: 'homepage-voice',
      nextRead: 'next-read',
      contextRelated: 'context-related',
      search: 'search',
    }
  },

  features: {
    socialPreview: false,
    diagrams: true,
    keyboardNav: true,
    progressTracking: true,
    recommendations: true,
    gamification: true,
    personalization: true,
    spaceRepetition: true,
    missions: true,
    games: true,
    highlights: true,
  },

  tutor: {
    mode: 'mock',
    escalationThreshold: 0.3,
    authorName: 'Pavel'
  },

  // Styly čtení pro děti (8–15 let)
  voices: {
    explorer: { label: 'Průzkumník', icon: '\u{1F50D}', description: 'Jak to funguje? Ukaž mi!' },
    creator: { label: 'Tvůrce', icon: '\u{1F3A8}', description: 'Chci si něco postavit!' },
    thinker: { label: 'Myslitel', icon: '\u{1F9E0}', description: 'Proč to tak funguje?' }
  }
};
