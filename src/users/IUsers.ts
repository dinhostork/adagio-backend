export interface IUsers {
  id?: number;
  name: string;
  email: string;
  active: boolean;
  verified: boolean;
  admin: boolean;
  password: string;
  register_ip: string;
}
