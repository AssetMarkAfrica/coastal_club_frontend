export interface Venue {
  title: string;
  tag: string;
  route: string;
  icon: string;
  description: string;
  images: string[];
  accent?: string;
}

export const VENUES: Venue[] = [
  {
    title: "The Sky Bar",
    tag: "54th Floor · Rooftop Oasis",
    route: "/skybar",
    icon: "roofing",
    description: "Elevated social energy featuring 360° city views, master cocktail artistry, curated DJ sets, and glowing fire pits under the stars.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar2_wt66as.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar3_cudwrl.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar4_mfresm.png",
    ],
  },
  {
    title: "Fine Dining",
    tag: "Ground Floor · Haute Cuisine",
    route: "/fine-dining",
    icon: "restaurant",
    description: "Our flagship chef's table destination — 7-course tasting menus, hyper-seasonal coastal sourcing, and a 1,500-vintage cellar.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining1_bmcrtp.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining2_mluv5r.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining3_ulq0dx.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787761393/FineDining6_hwvzt2.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining5_dzbvnr.png",
    ],
  },
  {
    title: "Executive Lounge",
    tag: "Members Only · Vault & Spirits",
    route: "/executive-lounge",
    icon: "diamond",
    description: "A private sanctum reserved exclusively for distinguished members. Rare pre-prohibition spirits, live acoustics, and plush velvet surrounds.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining2_mluv5r.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar3_cudwrl.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
    ],
  },
  {
    title: "The Private Room",
    tag: "Exclusive Hire · Events & Boardroom",
    route: "/private-room",
    icon: "meeting_room",
    description: "A fully soundproofed private space crafted for executive boardroom sessions, milestone celebrations, and bespoke dinners for up to 20 guests.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758506/PrivateRoom2_gcowvn.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758506/PrivateRoom3_cvokpc.png",
    ],
  },
];
