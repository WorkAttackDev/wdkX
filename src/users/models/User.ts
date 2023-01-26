export type FullUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  password: string;
  pictureId?: string | null;
  providerId?: string | null;
  role: string;
  updatedAt: Date | string;
  createdAt: Date | string;
  isDeleted?: boolean;
};

export type User = Omit<FullUser, "password">;
