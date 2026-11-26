// ============================================================
//  SAKURA BLOOM — WEDDING TEMPLATE SETTINGS
//  Change the values below for each new couple.
//  Every page (intro screen, invitation, admin) reads from here.
// ============================================================

export const WEDDING = {
  groom: {
    name: 'Akil',
    parents: 'Son of Mr. Randima & Mrs. Dammika',
  },
  bride: {
    name: 'Sanjana',
    parents: 'Daughter of Mr. Sudath & Mrs. Anoma',
  },

  // Used by the countdown timer (YYYY-MM-DDTHH:MM:SS, 24-hour local time)
  dateISO: '2026-12-10T09:17:00',
  // How the date is written on the page
  dateText: 'December 10, 2026',
  monthYearText: 'December 2026',

  // Shown on the first screen (intro video), under the names and date
  introTime: 'Poruwa Ceremony • 9:17 AM',

  venue: {
    name: 'Cinnamon Life at City of Dreams',
    hall: 'Cumulus Ballroom Hall',
    city: 'Colombo',
    quote: '"A beautiful and sacred place where we will unite and celebrate our love with joy."',
    mapUrl: 'https://maps.app.goo.gl/bqYUw6SnqUYfkERL8',
    imageUrl: 'https://d18slle4wlf9ku.cloudfront.net/www.cinnamonhotels.com-1754953340/cms/imagepool/68fee5fb1582c.png',
  },

  // Times listed in the ceremony section (add, remove or reorder freely)
  schedule: [
    { label: 'Reception', time: '9:30 AM' },
    { label: 'Poruwa Ceremony', time: '9:17 AM' },
    { label: 'Departure', time: '3:30 PM' },
  ],

  // Files in the /public folder
  // First screen image (shown before the video plays). Tip: use the video's first frame.
  introImage: '/intro-poster.jpg',
  introVideo: '/Couple_walking_along_wooden_pathway_547230dd.mp4',
  music: '/WhatsApp Video 2026-09-06 at 15 (mp3cut.net).mp3',

  // Google Apps Script web app URL that saves RSVPs and wishes
  formsScriptUrl: 'https://script.google.com/macros/s/AKfycbzWYC3LHwVZUsUowuUDHqLGE2iUVw9KIVrXc7TVQ7L0hS-OFv9q9JYdAtJO6ynmMaPQ/exec',
};

export const COUPLE_NAMES = `${WEDDING.groom.name} & ${WEDDING.bride.name}`;
