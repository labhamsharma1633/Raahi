// Centralized Configuration for Raahi Explainer Video
// To update with your final hosted MP4 / WebM / CDN asset, replace `videoUrl` below.
export const RAAHI_EXPLAINER_VIDEO_CONFIG = {
  title: 'Get to know Raahi in 60 seconds',
  subtitle: 'Discover how Raahi brings people, journeys and communities together to make everyday convenience smarter.',
  // Video asset URL (configure your hosted video or leave null for interactive built-in visual demo)
  videoUrl: '', 
  posterImage: null, // Custom image URL or null to use the styled SVG poster
  durationSeconds: 60,
  chapters: [
    { time: '0:00', title: 'What is Raahi?', desc: 'A community-powered commute & convenience network.' },
    { time: '0:10', title: 'Earn on the Way', desc: 'Commuters offset everyday metro and travel fares.' },
    { time: '0:22', title: 'Everyday Deliveries', desc: 'Groceries, notes, and medicines brought with minimal detour.' },
    { time: '0:34', title: 'Group Shopping', desc: 'Roommates pool baskets to beat minimum order thresholds.' },
    { time: '0:45', title: 'Quick Errands', desc: 'Peer favors in PGs and offices with secure 4-digit OTPs.' },
    { time: '0:54', title: 'Campus & Community', desc: 'One account, two trusted networks across India.' },
  ],
};
