export interface GetUser {
  id: number;
  name: string;
  userId: string;
}

export interface SignIn {
  accessToken: string;
  refreshToken: string;
}
