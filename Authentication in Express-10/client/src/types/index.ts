import type { Dispatch, SetStateAction, RefObject } from 'react';
export type DbEntry = {
  _id: string;
  createdAt: string;
  updatedAt?: string;
};
export type PostInput = {
  title: string;
  image: string;
  content: string;
};
export type PostData = {
  title: string;
  image: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
};

export type DbPost = DbEntry & PostData;

export type SetPost = Dispatch<SetStateAction<DbPost | null>>;

export type User = DbEntry & {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

export type LoginData = { email: string; password: string };

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthContextType = {
  signedIn: boolean;
  user: User | null;
  handleSignIn: ({ email, password }: LoginData) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleRegister: (formState: RegisterData) => Promise<void>;
};

export type ModalRef = RefObject<HTMLDialogElement | null>;
