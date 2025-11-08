export interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  createdAt: string;
}

export interface UserWithPasswordHash extends User {
  passwordHash: string;
}

