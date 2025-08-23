import { DocumentReference } from "firebase/firestore";
import { ReactNode } from "react";

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
    imageCount: number;
    tags: string[];
    collection: string;
    collectionName: string;
    authorID: string;
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
    imageCount: number;
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
    subRepo?: boolean;
    workshop?: string;
  };
};

export type VehicleItemType = {
  data: {
    description: string;
    make: string;
    model: string;
    year: number;
    engine: {
      size: number;
      fuel: "petrol" | "diesel" | "electric" | "hybrid";
    };
    transmission: "manual" | "automatic" | "semi-automatic";
    history: VehicleHistoryType;
  };
  metaData: {
    date: {
      created: string;
      modified: string;
    };
    authorID: string;
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
  technicianRef: DocumentReference;
  technician?: UserType;
  work: string[];
  isFleetService: boolean;
  isFleetEnrollment: boolean;
}[];

export type ItemTypes = "projects" | "recipes" | "albums" | "blog" | "vehicles";

export type CombinedItemProps = ItemProps &
  BlogItemProps &
  ProjectItemProps &
  RecipeItemProps &
  AlbumItemProps;

export type BlogItemProps = ItemProps;

export type ProjectItemProps = ItemProps & {
  metaData: {
    repoName: string;
    subRepo?: boolean;
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
      provider: "google" | "bing" | "duckduckgo";
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

export type UserType = {
  about: {
    userName: string;
    displayName: string;
    firstName: string;
    lastName: string;
    statement: string;
  };
  images: {
    header: string;
    profile: string;
    background: string;
    backgroundType: string;
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
  };
  links: string[];
  settings: {
    showOrganization: boolean;
  };
  organization?: {
    id: string;
    title: string;
    email: string;
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
  },
  links: [],
  settings: {
    showOrganization: false,
  },
};

type Overlay_PositionType =
  | "top left"
  | "top right"
  | "top center"
  | "bottom left"
  | "bottom right"
  | "bottom center"
  | "center left"
  | "center right"
  | "center";
type Overlay_DirectionType =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse";

export type OverlayType = {
  data: {
    title: string;
    style: number;
    colorScheme: "light" | "dark" | "custom";
    customColor?: string; // Hex color code for custom color scheme
    logo?: string; // URL or path to a logo image
    logoPosition: Overlay_PositionType | "main header" | "sub header";
    socials: {
      items: {
        handle: string;
        platform: string; // e.g., "github", "twitter", "linkedin"
      }[];
      position: Overlay_PositionType;
      direction: Overlay_DirectionType;
    };
    header: {
      main: string;
      sub: string;
      position: Overlay_PositionType;
      direction: Overlay_DirectionType;
    };
    radio: {
      visibility: boolean;
      style: string;
      position: Overlay_PositionType;
      station: "SR" | "SR Rock" | "SR Dance" | "SR Xmas";
      duration: number; // in seconds | -1 for infinite
      durationBar: boolean; // whether to show a duration bar
      showDJ: boolean; // whether to show the DJ name
      showStation: boolean; // whether to show the station name
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
