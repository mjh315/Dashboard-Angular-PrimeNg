export interface RegisterReqDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginReqDto {
  email: string;
  password: string;
}

export interface RefreshTokenReqDto {
  accessToken: string;
  refreshToken: string;
}