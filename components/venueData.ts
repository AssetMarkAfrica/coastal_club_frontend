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
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925574/FineDining1_eielrg.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925574/FineDining2_i5qhaz.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925574/FineDining3_zpycce.png",
    ],
  },
  {
    title: "Executive Lounge",
    tag: "Members Only · Vault & Spirits",
    route: "/executive-lounge",
    icon: "diamond",
    description: "A private sanctum reserved exclusively for distinguished members. Rare pre-prohibition spirits, live acoustics, and plush velvet surrounds.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925665/ExecutiveLounge1_zsodlx.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925665/ExecutiveLounge2_cmkkyt.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925667/ExecutiveLounge3_lzweye.png",
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
  {
    title: "Sunset Bar",
    tag: "Glass-Canopied Rooftop",
    route: "/sunset-bar",
    icon: "local_bar",
    description: "A glass-canopied rooftop sanctuary offering panoramic city views at dusk, complete with crafted cocktails and rattan furnishings.",
    images: [
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927332/SunsetBar1_yuqcpe.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927333/SunsetBar2_bgk0fk.png",
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927332/SunsetBar3_hmuhvc.png",
    ],
  },
];
