export const mockMovies = [
  {
    id: "m-1",
    title: "Neon Horizon",
    type: "Trailer",
    dateAdded: "2023.10.24",
    aiScore: 9.2,
    audienceScore: 8.7,
    status: "APPROVED",
    totalReviews: "1,284",
    parameters: [
      { subject: 'Acting', A: 85, fullMark: 100 },
      { subject: 'Visuals', A: 95, fullMark: 100 },
      { subject: 'Pacing', A: 70, fullMark: 100 },
      { subject: 'Originality', A: 90, fullMark: 100 },
      { subject: 'Audio', A: 88, fullMark: 100 },
    ],
    demographics: {
      age: [ { name: "18-24", value: 42 }, { name: "25-34", value: 38 }, { name: "35+", value: 20 } ],
      gender: [ { name: "Female", value: 54 }, { name: "Male", value: 41 }, { name: "Other", value: 5 } ]
    },
    reviews: [
      { id: "r-1", format: "text", user: "@ARCHI_Lover", tag: "HIGH RELEVANCE", time: "2 MINS AGO", timestamp: 1718000000, text: "The visual language of 'Neon Horizon' is breathtaking. The use of practical effects blended with minimalist CGI creates a unique blueprint-style aesthetic.", score: 9.5, sentiment: "POSITIVE", relevanceScore: 98 },
      { id: "r-2", format: "audio", user: "@VOICE_AUDITOR", tag: "AUDIO FEEDBACK", time: "15 MINS AGO", timestamp: 1717990000, duration: "0:45", text: "[Transcribed Audio]: The sound mixing on the trailer was super crisp. The low-frequency bass drop at 0:30 gave me chills.", score: 8.8, sentiment: "POSITIVE", relevanceScore: 85, audioUrl: "https://example.com/audio1.mp3" },
      { id: "r-3", format: "video", user: "@CRITIC_JOHN", tag: "VIDEO AUDIT", time: "1 HOUR AGO", timestamp: 1717950000, duration: "1:20", text: "[Transcribed Video]: Here is my visual reactions to Act 2. Notice how the lighting contrast shifts from cool gray to warm amber.", score: 7.2, sentiment: "MIXED", relevanceScore: 92, videoUrl: "https://example.com/video1.mp4" },
      { id: "r-4", format: "text", user: "@STRUCTURAL_GRID", tag: "TECHNICAL MERIT", time: "4 HOURS AGO", timestamp: 1717900000, text: "Lighting choices during the climax were slightly too dark on mobile displays.", score: 6.8, sentiment: "NEGATIVE", relevanceScore: 60 }
    ]
  },
  {
    id: "m-2",
    title: "E04: Structural Integrity",
    type: "Podcast",
    dateAdded: "2023.10.22",
    aiScore: 7.8,
    audienceScore: 8.1,
    status: "APPROVED",
    totalReviews: "842",
    parameters: [
      { subject: 'Flow', A: 82, fullMark: 100 },
      { subject: 'Clarity', A: 90, fullMark: 100 },
      { subject: 'Pacing', A: 65, fullMark: 100 },
      { subject: 'Originality', A: 88, fullMark: 100 },
      { subject: 'Audio', A: 95, fullMark: 100 },
    ],
    demographics: {
      age: [ { name: "18-24", value: 15 }, { name: "25-34", value: 55 }, { name: "35+", value: 30 } ],
      gender: [ { name: "Female", value: 48 }, { name: "Male", value: 50 }, { name: "Other", value: 2 } ]
    },
    reviews: [
      { id: "r-5", format: "audio", user: "@POD_FANATIC", tag: "AUDIO FEEDBACK", time: "1 DAY AGO", timestamp: 1717800000, duration: "2:10", text: "[Transcribed Audio]: The guest speaker explained concrete load-bearing limits with extreme precision.", score: 9.0, sentiment: "POSITIVE", relevanceScore: 90, audioUrl: "https://example.com/audio2.mp3" }
    ]
  },
  {
    id: "m-3",
    title: "Blueprint: A Study in Grays",
    type: "Article",
    dateAdded: "2023.10.20",
    aiScore: 8.5,
    audienceScore: 6.4,
    status: "NOT APPROVED",
    totalReviews: "45",
    parameters: [
      { subject: 'Grammar', A: 95, fullMark: 100 },
      { subject: 'Formatting', A: 80, fullMark: 100 },
      { subject: 'Pacing', A: 50, fullMark: 100 },
      { subject: 'Originality', A: 60, fullMark: 100 },
      { subject: 'Visuals', A: 40, fullMark: 100 },
    ],
    demographics: {
      age: [ { name: "18-24", value: 10 }, { name: "25-34", value: 30 }, { name: "35+", value: 60 } ],
      gender: [ { name: "Female", value: 30 }, { name: "Male", value: 65 }, { name: "Other", value: 5 } ]
    },
    reviews: []
  }
];

export const mockCampaigns = [
  {
    id: "c-1",
    mediaId: "m-1",
    sponsorName: "Axiom Design Vault",
    title: "Architectural Asset Pack v2.0",
    percentileThreshold: 95,
    totalBudget: "$5,000",
    claimedBudget: "$3,250",
    activeVouchers: 130,
    status: "ACTIVE"
  },
  {
    id: "c-2",
    mediaId: "m-1",
    sponsorName: "Vellum Render Lab",
    title: "Pro Octane Shader Preset Key",
    percentileThreshold: 90,
    totalBudget: "$2,500",
    claimedBudget: "$2,500",
    activeVouchers: 100,
    status: "FINISHED"
  },
  {
    id: "c-3",
    mediaId: "m-2",
    sponsorName: "Structural Audio Lab",
    title: "Pro Soundscape Preset Key",
    percentileThreshold: 90,
    totalBudget: "$2,000",
    claimedBudget: "$800",
    activeVouchers: 40,
    status: "PAUSED"
  }
];