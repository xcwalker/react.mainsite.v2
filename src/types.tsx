import { ReactNode } from "react";

export type LibraryItemType = { image: LibraryImageType; data: LibraryDataType; metadata: LibraryMetaDataType };
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