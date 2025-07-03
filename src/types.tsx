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

export type BlogItemProps = ItemProps & {};

export type BlogItem = {
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
    imageCount: number;
    hasThumbnail?: boolean;
    tags: string[];
    collection: string;
    collectionName: string;
    authorID: string;
  };
};

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

export type RecipeItem = {
  data: {
    title: string;
    subTitle: string;
    description?: string;
    instructions: {
      prep?: string[];
      cook: string[];
    };
    ingredients: string[];
    information: {
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
    imageCount: number;
    youtube?: string;
    tags: string[];
    collection: string;
    collectionName: string;
    colors: {
      dark: string;
      light: string;
    };
    authorID: string;
  };
};

export type AlbumItem = {
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
    slug: string;
    imageCount: number;
    tags: string[];
    collection: string;
    collectionName: string;
    authorID: string;
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
      type?: string; // "image" | "color"
      color?: string; // Hex color code if type is "color"
      filter?: string; // CSS filter for the background image
    };
    color?: string; // Hex color code for the text
    showOrganization: boolean;
    showUser: boolean;
    showSearch: boolean;
    search: {
      provider: string; // "google" | "bing" | "duckduckgo"
      queryURL: string; // URL template for search queries
      defaultParams?: string; // Additional default parameters for the search query
    };
  };
};

export type UserType = {
  about: {
    userName: string;
    displayName: string;
    firstName: string;
    lastName: string;
    status: string;
    statement: string;
  };
  images: {
    header: string;
    profile: string;
    background?: string;
    backgroundType?: string;
  };
  info: {
    gender: string;
    location: string;
    pronouns: string;
    joined: string;
    lastOnline: string;
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
