export interface User {
  id?: number;
  email: string;
  password: string;
}

export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  birthDate: Date;
  status: boolean;
  userName: string;
  email: string;
}