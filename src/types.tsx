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
    hasThumbnail?: boolean;
  };
};

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
    hasThumbnail?: boolean;
  };
};

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

export type ProjectItem = {
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
    tags: string[];
    collection: string;
    collectionName: string;
    repoName: string;
    subRepo?: boolean;
    workshop: string;
    authorID: string;
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