/* ==========================================================
   AminaAndEren – site content
   Edit everything here. No other file needs to change.
   Dates use the format "YYYY-MM-DDTHH:MM:SS" (local time).
   ========================================================== */
window.SITE_CONFIG = {
  couple: {
    first: "Amina",
    second: "Eren",
    tagline: "Two birthdays, one big celebration."
  },

  // Each person's next birthday (month/day only matters; year is ignored for the countdown)
  birthdays: [
    {
      name: "Amina",
      month: 12,
      day: 12,
      note: "The one who laughs first and loudest. Placeholder text — write something sweet about Amina here."
    },
    {
      name: "Eren",
      month: 12,
      day: 27,
      note: "The calm one with the best playlists. Placeholder text — write something sweet about Eren here."
    }
  ],

  // The party everyone counts down to
  party: {
    date: "2026-12-19T18:00:00",
    place: "The Rose Garden Room",
    address: "12 Placeholder Street, Edinburgh",
    dress: "Soft pinks & whites, sparkle welcome",
    mapLink: "https://maps.google.com",
    schedule: [
      { time: "18:00", what: "Doors open & welcome drinks" },
      { time: "19:00", what: "Dinner" },
      { time: "20:30", what: "Cake & speeches" },
      { time: "21:00", what: "Dancing until late" }
    ]
  },

  story: [
    { when: "Spring 2019", title: "Hello, you", text: "The first time we met. Replace this with your own story — a funny first impression works great." },
    { when: "Summer 2020", title: "Our first trip", text: "A little road trip, too many snacks, and the moment we knew this was something special." },
    { when: "Winter 2022", title: "Moving in together", text: "Boxes everywhere, two plants, and one very opinionated sofa." },
    { when: "Autumn 2025", title: "Today & always", text: "Another year, another candle each. Thank you for celebrating with us." }
  ],

  // Gallery: replace the src paths with your own photos in assets/images/
  photos: [
    { src: "assets/images/photo-1.svg", alt: "Amina and Eren together",  caption: "Where it all began" },
    { src: "assets/images/photo-2.svg", alt: "A sunny day out",          caption: "Sunday walks" },
    { src: "assets/images/photo-3.svg", alt: "Dinner with friends",      caption: "Dinner for two" },
    { src: "assets/images/photo-4.svg", alt: "Dancing at a wedding",     caption: "Dance floor regulars" },
    { src: "assets/images/photo-5.svg", alt: "Holiday by the sea",       caption: "Salt in our hair" },
    { src: "assets/images/photo-6.svg", alt: "Birthday last year",       caption: "Last year’s candles" }
  ],

  letter: {
    greeting: "To Amina & Eren,",
    paragraphs: [
      "This is placeholder text for a love letter. Write about what you admire in each other, a memory only the two of you share, and what you’re looking forward to this year.",
      "You can write as many paragraphs as you like. Keep it warm, specific and a little bit silly — those are the lines people remember.",
      "Happy birthday to both of you. Here’s to more candles, more cake and more of us."
    ],
    signoff: "With all our love,",
    from: "Your family & friends"
  },

  // Optional song. Put the file in assets/audio/. If missing, the music button hides itself.
  music: {
    src: "assets/audio/song.mp3",
    volume: 0.5
  },

  // RSVP: leave empty to only save answers in this browser (demo mode).
  // To receive real replies, paste a Formspree / Getform endpoint URL here.
  rsvpEndpoint: "",

  // Starter guestbook messages (visitors can add more; saved in their own browser)
  seedWishes: [
    { name: "Mum", text: "So proud of you both. Eat lots of cake!" },
    { name: "Selin", text: "Happy birthday, lovebirds. See you on the dance floor." },
    { name: "Jordan", text: "Wishing you a year as sweet as the frosting." }
  ]
};
