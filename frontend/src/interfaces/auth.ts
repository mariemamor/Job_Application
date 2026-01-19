export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: "user" | "business" | "admin";
}

export interface IAuthResponse {
  status: boolean;
  message: string;
  token: string;
  user?: IUser;
}
