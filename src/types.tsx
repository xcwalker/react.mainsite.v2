import { ReactNode } from "react";

export type LibraryItemType = {
  image: LibraryImageType;
  data: LibraryDataType;
  metadata: LibraryMetaDataType;
};
export type LibraryImageType = { url: string; title: string };
export type LibraryDataType = { title: string; subtitle?: string };
export type LibraryMetaDataType = { route: string; url: string; date: Date };

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
    slug: string;
    imageCount: number;
    hasThumbnail?: boolean;
    tags: string[];
    collection: string;
    collectionName: string;
    author: {
      name: string;
      image: {
        webpURL: string;
        jpgURL: string;
      };
    };
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
    slug: string;
    imageCount: number;
    tags: string[];
    collection: string;
    collectionName: string;
    repoName: string;
    subRepo?: boolean;
    workshop: string;
    author: {
      name: string;
      image: {
        webpURL: string;
        jpgURL: string;
      };
    };
  };
};

export type RecipeItem = {
  data: {
    title: string;
    subTitle: string;
    description?: string;
    instructions: {
      prep?: [];
      cook: [];
    };
    ingredients: [];
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
    youtube?: string
    tags: string[];
    collection: string;
    collectionName: string;
    colors: {
      dark: string;
      light: string;
    };
    author: {
      name: string;
      image?: {
        webpURL: string;
        jpgURL: string;
      };
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