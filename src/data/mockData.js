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
      age: [ 
        { name: "18-24", value: 42 }, 
        { name: "25-34", value: 38 }, 
        { name: "35+", value: 20 } 
      ],
      gender: [ 
        { name: "Female", value: 54 }, 
        { name: "Male", value: 41 }, 
        { name: "Other", value: 5 } 
      ]
    },
    reviews: [
      { tag: "HIGH RELEVANCE", time: "2 MINS AGO", text: "The visual language of 'Neon Horizon' is breathtaking. The use of practical effects blended with minimalist CGI creates a unique blueprint-style aesthetic I haven't seen in years.", score: 9.5, sentiment: "POSITIVE" },
      { tag: "STRUCTURAL INSIGHT", time: "1 HOUR AGO", text: "Pacing felt slightly staggered in the second act, but the sound design kept the tension palpable. The orchestral score is haunting and structural.", score: 7.2, sentiment: "MIXED" },
      { tag: "TECHNICAL MERIT", time: "4 HOURS AGO", text: "Lighting choices during the climax were too dark on mobile screens, though the underlying cinematography is mathematically perfect.", score: 6.8, sentiment: "NEGATIVE" }
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
      age: [ 
        { name: "18-24", value: 15 }, 
        { name: "25-34", value: 55 }, 
        { name: "35+", value: 30 } 
      ],
      gender: [ 
        { name: "Female", value: 48 }, 
        { name: "Male", value: 50 }, 
        { name: "Other", value: 2 } 
      ]
    },
    reviews: [
      { tag: "AUDIO FIDELITY", time: "1 DAY AGO", text: "The vocal mixing on this episode is pristine. Every architectural concept was explained with incredible clarity without relying on visual aids.", score: 9.0, sentiment: "POSITIVE" },
      { tag: "PACING", time: "2 DAYS AGO", text: "The middle segment dragged a bit when discussing concrete load limits, but the opening and closing thoughts were brilliant.", score: 7.0, sentiment: "MIXED" }
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
      age: [ 
        { name: "18-24", value: 10 }, 
        { name: "25-34", value: 30 }, 
        { name: "35+", value: 60 } 
      ],
      gender: [ 
        { name: "Female", value: 30 }, 
        { name: "Male", value: 65 }, 
        { name: "Other", value: 5 } 
      ]
    },
    reviews: [
      { tag: "CONTENT WARNING", time: "3 DAYS AGO", text: "The formatting breaks completely on mobile devices. The text overlaps with the wireframe images, making it impossible to read.", score: 4.0, sentiment: "NEGATIVE" }
    ]
  }
];