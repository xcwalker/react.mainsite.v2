import { ReactNode } from "react";

export type NavItem = {
  title: string;
  href: string;
  gficon: string;
  hidden?: boolean;
  isBeta?: boolean;
  requireUser?: boolean;
  requireVerified?: boolean;
  devOnly?: boolean;
};

export type NavSection = {
  title: string;
  hideTitle?: boolean;
  items: NavItem[];
};

export const defaultNav: NavSection[] = [
  {
    title: "Main Navigation",
    hideTitle: true,
    items: [
      {
        title: "New Tab",
        href: "/newtab",
        gficon: "new_window",
        hidden: true,
      },
      {
        title: "home",
        href: "",
        gficon: "home",
      },
      {
        title: "Projects",
        href: "projects",
        gficon: "design_services",
      },
      {
        title: "Blog",
        href: "blog",
        gficon: "text_snippet",
      },
      {
        title: "Recipes",
        href: "recipes",
        gficon: "stockpot",
      },
      {
        title: "Albums",
        href: "albums",
        gficon: "image",
      },
      {
        title: "Videos",
        href: "videos",
        gficon: "airplay",
      },
      {
        title: "Games",
        href: "games",
        gficon: "sports_esports",
      },
      {
        title: "Fleet",
        href: "vehicles",
        gficon: "directions_car",
        isBeta: true,
      },
      {
        title: "Overlay",
        href: "overlay",
        gficon: "layers",
        isBeta: true,
        requireUser: true,
        requireVerified: true,
      },
      {
        title: "Organizations",
        gficon: "apartment",
        href: "organizations",
        requireUser: true,
        isBeta: true,
      },
      {
        title: "Users",
        gficon: "group",
        href: "users",
      },
      {
        title: "Profile",
        href: "me",
        gficon: "person",
        requireUser: true,
      },
      {
        title: "dashboard",
        href: "dashboard",
        gficon: "dashboard",
        requireUser: true,
      },
      {
        title: "dashboard new",
        href: "dashboard-new",
        gficon: "dashboard",
        requireUser: true,
        devOnly: true,
      },
      {
        title: "Login",
        href: "account",
        gficon: "login",
        requireUser: false,
      },
      {
        title: "settings",
        href: "settings",
        gficon: "settings",
        requireUser: true,
      },
      {
        title: "Contact",
        href: "ticket",
        gficon: "contact_support",
        isBeta: true,
      },
      {
        title: "Developer",
        href: "developer",
        gficon: "code",
        devOnly: true,
      },
    ],
  },
  {
    title: "Sites",
    items: [
      {
        title: "xcwalker.dev",
        href: "https://xcwalker.dev/",
        gficon: "deployed_code",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/XCWalkerDev.svg",
      },
      {
        title: "Parnix",
        href: "https://parnix.uk/",
        gficon: "frame_inspect",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Parnix.svg",
      },
      {
        title: "Immersion V2",
        href: "https://v2.immersion.xcwalker.dev/",
        gficon: "auto_awesome_mosaic",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
      },
      {
        title: "Immersion",
        href: "https://immersion.xcwalker.dev/",
        gficon: "grid_view",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
      },
      {
        title: "Searrson",
        href: "https://searrson.xcwalker.dev/",
        gficon: "wallpaper_slideshow",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
      },
      {
        title: "Therwim",
        href: "https://therwim.xcwalker.dev/",
        gficon: "web",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
      },
    ],
  },
  {
    title: "ReactRadio",
    items: [
      {
        title: "Desktop",
        href: "https://reactradio.dev/",
        gficon: "desktop_windows",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
      },
      {
        title: "Mobile",
        href: "https://mobile.reactradio.dev/",
        gficon: "smartphone",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
      },
      {
        title: "Legacy",
        href: "https://legacy.reactradio.dev/",
        gficon: "devices",
        // iconURL:
        // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
      },
    ],
  },
];

type Classes = {
  id?: string;
  className?: string;
};

export type SectionType = {
  id: string;
  className?: string;
  children: ReactNode;
  container?: Classes;
  style?: React.CSSProperties;
  background?: ReactNode;
};

export type StackType = {
  children: ReactNode;
  direction?: string;
  gap?: string;
};

export type GridItem = {
  data: {
    title: string;
    subTitle: string;
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    tags: string[];
    collection: string;
    thumbnail: string;
  };
};

export interface ItemProps {
  data: {
    title: string;
    subTitle: string;
    description: string;
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    thumbnail: string;
    hasThumbnail?: boolean;
    images: string[];
    tags: string[];
    collection: string;
    collectionName: string;
    authorID: string;
    parnix?: string;
  };
}

export interface GridItemProps {
  data: {
    title: string;
    subTitle: string;
    description?: string;
  };
  metaData: {
    date: {
      created?: string;
      modified: string;
    };
    thumbnail: string;
    hasThumbnail?: boolean;
    images?: string[];
    tags?: string[];
    collection?: string;
    collectionName?: string;
    authorID?: string;
  };
}

export type ItemType = {
  data: {
    title: string;
    subTitle: string;
    description: string;

    instructions?: {
      prep?: string[];
      cook: string[];
    };
    ingredients?: string[];
    information?: {
      prepTime: string;
      cookTime: string;
      serves: string;
    };
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    thumbnail: string;
    images: string[];
    youtube?: string;
    tags: string[];
    collection: string;
    collectionName: string;
    colors?: {
      dark: string;
      light: string;
    };
    authorID: string;
    key?: string;
    repoName?: string;
    subRepo?: string;
    workshop?: string;
    parnix?: boolean;
  };
};

export type VehicleItemType = {
  data: {
    description: string;
    make: string;
    model: string;
    year: number;
    history: VehicleHistoryType;
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    key: string;
    vin: string;
    thumbnail?: string;
  };
};

export type VehicleHistoryType = {
  date: string;
  milage_miles: number;
  location: string;
  notes: string;
  technicianRef: string;
  technician?: UserType;
  work: string[];
  isFleetService: boolean;
  isFleetEnrollment: boolean;
}[];

export type ItemTypes =
  | "projects"
  | "recipes"
  | "albums"
  | "blog"
  | "vehicles"
  | "videos";

export type CombinedItemProps = ItemProps &
  BlogItemProps &
  ProjectItemProps &
  RecipeItemProps &
  AlbumItemProps;

export type BlogItemProps = ItemProps;

export type VideoItemProps = ItemProps & {
  metaData: {
    youtube: string;
  };
};

export type ProjectItemProps = ItemProps & {
  metaData: {
    repoName: string;
    subRepo?: string;
    workshop: string;
    authorID: string;
  };
};

export type RecipeItemProps = ItemProps & {
  data: {
    ingredients: string[];
    instructions: {
      prep?: string[];
      cook: string[];
    };
    information: {
      prepTime: string;
      cookTime: string;
      serves: string;
    };
  };
  metaData: {
    youtube?: string;
    colors?: {
      dark: string;
      light: string;
    };
  };
};

export type AlbumItemProps = ItemProps & {
  metaData: {
    key: string;
  };
};

export type LinkItem = {
  title: string;
  url: string;
  icon?: string;
  color: string;
  background: {
    image?: string;
    type?: string; // "image" | "color"
    color?: string; // Hex color code if type is "color"
  };
  type?: "wide" | "narrow"; // Optional type for link display
  showTitle?: boolean; // Optional flag to show/hide title
};

export type NewTabLinks = {
  links: LinkItem[];

  settings: {
    background: {
      image?: string;
      type?: "image" | "color";
      color?: string; // Hex color code if type is "color"
      filter?: string; // CSS filter for the background image
    };
    color?: string; // Hex color code for the text
    showOrganization: boolean;
    showUser: boolean;
    showSearch: boolean;
    search: {
      provider: "google" | "bing" | "duckduckgo" | "custom";
      queryURL: string; // URL template for search queries
      defaultParams?: string; // Additional default parameters for the search query
    };
  };
};

export const NewTabLinksDefault: NewTabLinks = {
  links: [],
  settings: {
    background: {
      type: "color", // "image" | "color"
      color: "var(--background-200)", // Hex color code if type is "color"
    },
    color: "var(--text)", // Hex color code for the text
    showOrganization: false,
    showUser: true,
    showSearch: true,
    search: {
      provider: "google", // "google" | "bing" | "duckduckgo"
      queryURL: "https://google.com/search?&q=", // URL template for search queries
    },
  },
};

export type OrganizationType = {
  name: string;
  description: string;
  logo: {
    wide: {
      src: string;
      onDark: string;
      onLight: string;
    };
    icon: string;
    background: {
      type: "color" | "image";
      color?: string;
      imageUrl?: string;
    };
  };
  creator: string;
  inviteCodes?: string[];
  settings?: {
    allowJoinRequests: boolean;
    requireInviteCode: boolean;
    maxMembers?: number;
  };
};

export type UserType = {
  about: {
    userName: string;
    displayName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    statement: string;
  };
  images: {
    header: string;
    profile: string;
    background: string;
    backgroundType: string;
    color?: string;
  };
  info: {
    gender: string;
    location: string;
    pronouns: string;
    joined: string;
    lastOnline: string;
    role:
      | "unverified"
      | "user"
      | "admin"
      | "moderator"
      | "developer"
      | "Overlord";
    hidden: boolean;
  };
  links: string[];
  settings: {
    showOrganization: boolean;
  };
  organization?: {
    id: string;
    email?: string;
    role: "owner" | "admin" | "member";
    title?: string;
    inviteCode?: string;
  };
};

export const userSetup: UserType = {
  about: {
    userName: "Unknown",
    displayName: "Unknown",
    firstName: "New",
    lastName: "User",
    statement: "",
  },
  images: {
    backgroundType: "color",
    background: "var(--background-100)",
    header: "/background.svg",
    profile:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },
  info: {
    gender: "Unknown",
    location: "Unknown",
    pronouns: "Unknown",
    joined: new Date().toJSON(),
    lastOnline: new Date().toJSON(),
    role: "unverified",
    hidden: false,
  },
  links: [],
  settings: {
    showOrganization: false,
  },
};

export type userSettingsType = {
  theme: string;
  customThemeColor?: {
    text: string;
    textAlt: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    textInverse: string;
  };
  customThemes: customThemeType[];
  navigation: NavSection[];
  navigationShowSocials: boolean;
};

export type customThemeType = {
  name: string;
  colors: {
    text: string;
    textAlt: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    textInverse: string;
  };
};

export const userSettingsDefault: userSettingsType = {
  theme: "system",
  customThemes: [],
  navigation: defaultNav,
  navigationShowSocials: true,
};

export type Overlay_PositionType =
  | "top left"
  | "top right"
  | "top center"
  | "bottom left"
  | "bottom right"
  | "bottom center"
  | "center left"
  | "center right"
  | "center";

export const OverlayPositions: Overlay_PositionType[] = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right",
];

export type Overlay_PositionType_WithHeader =
  | Overlay_PositionType
  | "main header"
  | "sub header";

export type Overlay_DirectionType =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse";

export const OverlayDirections: Overlay_DirectionType[] = [
  "row",
  "column",
  "row-reverse",
  "column-reverse",
];

export type Overlay_TransitionType =
  | "fade"
  | "slide"
  | "zoom"
  | "zoom directional"
  | "zoom slide directional"
  | "none";

export const OverlayTransitions: Overlay_TransitionType[] = [
  "fade",
  "slide",
  "zoom",
  "zoom directional",
  "zoom slide directional",
  "none",
];

export type overlayType = {
  data: {
    title: string;
    style: number;
    colorScheme: "light" | "dark" | "custom";
    customColor?: string; // Hex color code for custom color scheme
    logo: {
      src: string; // URL or path to a logo image
      position: Overlay_PositionType;
      priority: number; // 1 (highest) to 5 (lowest)
    };
    socials: {
      items: {
        handle: string;
        platform: string; // e.g., "github", "twitter", "linkedin"
      }[];
      position: Overlay_PositionType;
      direction: Overlay_DirectionType;
      priority: number; // 1 (highest) to 5 (lowest)
    };
    tags: {
      items: (
        | {
            name: string;
            text: string;
          }
        | string
      )[];
      position: Overlay_PositionType | "header";
      direction: Overlay_DirectionType;
      priority: number; // 1 (highest) to 5 (lowest)
    };
    header: {
      main: string;
      sub: string;
      position: Overlay_PositionType;
      direction: Overlay_DirectionType;
      priority: number; // 1 (highest) to 5 (lowest)
    };
    radio: {
      visibility: boolean;
      style: string;
      position: Overlay_PositionType;
      station: Overlay_StationType;
      duration: number; // in seconds | -1 for infinite
      durationBar: boolean; // whether to show a duration bar
      showDJ: boolean; // whether to show the DJ name
      showStation: boolean; // whether to show the station name
      animation: {
        type: Overlay_TransitionType; // animation type for the radio element
        duration: number; // duration of the animation in milliseconds
      };
      priority: number; // 1 (highest) to 5 (lowest)
    };
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    thumbnail?: string;
    authorID: string;
  };
};

export const OverlayStations = ["SR", "SR Rock", "SR Dance", "SR Xmas"];

export type Overlay_StationType = "SR" | "SR Rock" | "SR Dance" | "SR Xmas";

export const OverlayDefault: overlayType = {
  data: {
    title: "",
    style: 1,
    colorScheme: "light",
    logo: {
      src: "",
      position: "top left",
      priority: 3,
    },
    socials: {
      items: [],
      position: "bottom left",
      direction: "row",
      priority: 3,
    },
    tags: {
      items: [],
      position: "top right",
      direction: "row",
      priority: 3,
    },
    header: {
      main: "",
      sub: "",
      position: "top center",
      direction: "column",
      priority: 3,
    },
    radio: {
      visibility: false,
      style: "style-1",
      position: "bottom right",
      station: "SR",
      duration: -1,
      durationBar: true,
      showDJ: true,
      showStation: true,
      animation: {
        type: "slide",
        duration: 500,
      },
      priority: 3,
    },
  },
  metaData: {
    date: {
      created: new Date().toJSON(),
      modified: new Date().toJSON(),
    },
    authorID: "",
  },
};

export type TicketType = {
  data: {
    title: string;
    messages: {
      sender: {
        id?: string;
        name?: string;
      };
      content: string;
      date: string;
    }[];
  };
  metaData: {
    date: {
      createdAt: string;
      updatedAt: string;
    };
    status: "open" | "in-progress" | "closed";
    assignee: string | null;
    priority: "low" | "medium" | "high" | "urgent" | "unknown";
    reporter: {
      id?: string;
      name?: string;
      email?: string;
    };
  };
};
