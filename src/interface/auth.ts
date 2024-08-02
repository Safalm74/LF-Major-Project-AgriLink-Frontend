export interface IUserToken {
  userDetails: IUserDetails;
  refreshToken: string;
  accessToken: string;
  farm?: IFarmIdAndName[];
}

export interface IUserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
}

interface IFarmIdAndName {
  id: string;
  name: string;
}
