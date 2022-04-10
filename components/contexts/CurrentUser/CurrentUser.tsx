import React from "react";
import { IBookCopy } from "#entities/BookCopy";
import { IUser } from "#entities/User";

export interface ICurrentUserContextValue {
  user: IUser;
  borrowedBookCopies: IBookCopy[];
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setBorrowedBookCopies: React.Dispatch<React.SetStateAction<IBookCopy[]>>;
}

export const CurrentUser = React.createContext<ICurrentUserContextValue>(null);
