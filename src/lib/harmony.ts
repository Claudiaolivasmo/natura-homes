
const privateWorkspaceRates = [
  { label: "hourly", schedule: null, amount: 10500 },
  { label: "halfDay", schedule: null, amount: 38000 },
  { label: "fullDayWorkspace", schedule: null, amount: 65000 },
] as const;

export const harmonySpaces = [
  {
    slug: "kairos",
    image: "/images/experiences/harmony/kairos-01.webp",
    galleryImages: [
      "/images/experiences/harmony/kairos-02.webp",
      "/images/experiences/harmony/kairos-03.webp",
      "/images/experiences/harmony/kairos-04.webp",
      "/images/experiences/harmony/kairos-05.webp",
      "/images/experiences/harmony/kairos-06.webp",
      "/images/experiences/harmony/kairos-07.webp",
    ],
    activityGroups: [
      {
        title: "activitiesTitle",
        items: ["individualWork", "privateMeetings", "consultations", "clientMeetings"],
      },
    ],
    pricing: { currency: "CRC", rates: privateWorkspaceRates },
    capacity: null,
    amenities: [],
  },
  {
    slug: "prisma",
    image: "/images/experiences/harmony/prisma-001.webp",
    galleryImages: [
      "/images/experiences/harmony/prisma-01.webp",
      "/images/experiences/harmony/prisma-02.webp",
      "/images/experiences/harmony/prisma-04.webp",
      "/images/experiences/harmony/prisma-05.webp",
      "/images/experiences/harmony/prisma-06.webp",
      "/images/experiences/harmony/prisma-07.webp",
    ],
    activityGroups: [
      {
        title: "activitiesTitle",
        items: ["independentWork", "privateMeetings", "appointments", "sessions"],
      },
    ],
    pricing: { currency: "CRC", rates: privateWorkspaceRates },
    capacity: null,
    amenities: [],
  },
  {
    slug: "agora",
    image: "/images/experiences/harmony/agora-001.webp",
    galleryImages: [
      "/images/experiences/harmony/agora-01.webp",
      "/images/experiences/harmony/agora-03.webp",
      "/images/experiences/harmony/agora-04.webp",
      "/images/experiences/harmony/agora-05.webp",
      "/images/experiences/harmony/agora-06.webp",
      "/images/experiences/harmony/agora-07.webp",
    ],
    activityGroups: [
      {
        title: "professionalTitle",
        items: ["workshops", "meetings", "presentations", "networking", "creative"],
      },
      {
        title: "socialTitle",
        items: ["family", "dinners", "birthdays", "celebrations", "privateEvents", "community"],
      },
    ],
    pricing: {
      currency: "CRC",
      rates: [
        { label: "morningSession", schedule: "morning", amount: 90000 },
        { label: "afternoonSession", schedule: "afternoon", amount: 90000 },
        { label: "fullDayAgora", schedule: "fullDay", amount: 150000 },
        { label: "additionalHour", schedule: "perHour", amount: 15000 },
      ],
    },
    capacity: 40,
    amenities: [
      "tablesChairs",
      "airConditioning",
      "highSpeedInternet",
      "projectionScreen",
      "soundSystem",
      "parking",
      "restrooms",
      "supportKitchen",
    ],
  },
] as const;

export type HarmonySpaceSlug = (typeof harmonySpaces)[number]["slug"];

export function getHarmonySpace(slug: string) {
  return harmonySpaces.find((space) => space.slug === slug);
}

export function harmonyInquiryHref(message: string) {
  return `/about-contact?topic=concierge&message=${encodeURIComponent(message)}#contact`;
}
