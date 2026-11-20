/* ==========================================================
   For Amina – content
   Edit everything here. No other file needs to change.
   Every text below is placeholder: make it yours.
   ========================================================== */
window.SITE_CONFIG = {
  to: "Amina",
  from: "Eren",

  // Her birthday: 7 December (the countdown rolls to next year automatically)
  birthday: { month: 12, day: 7 },

  // Slide: "Our story" (click to reveal one at a time)
  storyTitle: "Our story so far",
  story: [
    { when: "Spring 2019", title: "Hello, you",       text: "The first time we met. Replace this with your own story." },
    { when: "Summer 2020", title: "Our first trip",   text: "Too many snacks, one wrong turn, and the best day." },
    { when: "Winter 2022", title: "Moving in",        text: "Boxes everywhere, two plants, one opinionated sofa." },
    { when: "Autumn 2026", title: "Today",            text: "Still choosing you, every single day." }
  ],

  // Slide: "Photos" (each click drops a new polaroid onto the pile).
  // Replace the paths with your own photos in assets/images/
  photosTitle: "Some of my favourite moments",
  photos: [
    { src: "assets/images/photo-1.svg", alt: "Amina and Eren together", caption: "Where it all began" },
    { src: "assets/images/photo-2.svg", alt: "A sunny day out",         caption: "Sunday walks" },
    { src: "assets/images/photo-3.svg", alt: "Dinner together",         caption: "Dinner for two" },
    { src: "assets/images/photo-4.svg", alt: "Dancing",                 caption: "Dance floor regulars" },
    { src: "assets/images/photo-5.svg", alt: "Holiday by the sea",      caption: "Salt in our hair" },
    { src: "assets/images/photo-6.svg", alt: "Last birthday",           caption: "Last year’s candles" }
  ],

  // Slide: big lines, one per click
  linesLead: "Some things I think about a lot",
  lines: [
    "The way you laugh.",
    "How you care about everyone.",
    "Your terrible dance moves.",
    "How home feels like you."
  ],

  // Slide: tap-to-flip hearts
  reasonsTitle: "Why I love you",
  reasonsHint: "Tap each heart",
  reasons: [
    "You make ordinary days feel special.",
    "You’re the kindest person I know.",
    "Your laugh fixes my worst moods.",
    "You believe in me, even when I don’t.",
    "You’re my favourite person to be quiet with.",
    "You’re you, and that’s everything."
  ],

  // Slide: the letter
  letter: {
    title: "I wrote you a letter",
    hint: "Tap the envelope",
    greeting: "My Amina,",
    paragraphs: [
      "This is placeholder text for your letter. Write about what you admire in her, a memory only the two of you share, and what you’re looking forward to this year.",
      "Keep it warm, specific and a little bit silly. Those are the lines she’ll remember.",
      "Happy birthday. Here’s to more candles, more cake and more of us."
    ],
    signoff: "All my love,"
  },

  // Final slide: the gift reveal
  gift: {
    lead: "One last thing",
    title: "Your gift is ready",
    button: "Open your gift",
    headline: "Happy birthday, Amina",
    text: "Placeholder gift: a weekend away, just the two of us. Details on the day, I promise."
  },

  // Optional song. Put the file in assets/audio/. If missing, the music button hides itself.
  music: { src: "assets/audio/song.mp3", volume: 0.5 }
};
