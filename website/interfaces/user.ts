interface IUserInfo {
  avatar: String;
  description: String;
}

export interface IUser {
  _id: String;
  username: String;
  email: String;
  userInfo: IUserInfo;
}