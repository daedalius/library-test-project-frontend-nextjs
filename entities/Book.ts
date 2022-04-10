import { IAuthor } from "./author";

export interface IBook {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  authors: IAuthor[];
}
