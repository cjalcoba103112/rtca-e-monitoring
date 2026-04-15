

export type Usertbl = {
  userId?: number;
  userName?: string;
  salt?: string;
  hashedPassword?: string;
  email?: string | null;
};
