export class User {
  id: number;
  username: string;
  password: string;
  profilePhoto?: string;
  email: string;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    profilePhoto?: string,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.email = email;
  }
}
