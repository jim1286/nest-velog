export interface GetUser {
  userId: string;
  name: string;
  userName: string;
}

export interface SignIn {
  accessToken: string;
  refreshToken: string;
}
