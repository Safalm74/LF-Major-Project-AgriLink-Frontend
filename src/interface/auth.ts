export interface IUserToken {
  userDetails: IUserDetails;
  refreshToken: string;
  accessToken: string;
  farm?: IfarmIdAndName[];
}

export interface IUserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
}

interface IfarmIdAndName {
  id: string;
  name: string;
}
