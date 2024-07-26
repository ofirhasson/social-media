export type Address = {
  state: string;
  region: string;
  city: string;
};

export type Photos = {
  profileImage: string;
  coverImage: string;
};

export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  gender: string;
  birthday: string;
};

export class UserModel {
  _id: string;
  userDetails: UserDetails;
  address: Address;
  friendRequests: string[];
  sentFriendRequests: string[];
  friends: string[];
  profileImage: string;
  coverImage: string;
  postsAlbum: string[];
  profileAlbum: string[];
  coverAlbum: string[];
  bio: string;
  posts: string[];
  likedPosts: string[];
  isActive: boolean;
  lastSeen: Date;
  photos: Photos;




   public constructor(
    _id: string = "",
    userDetails: UserDetails = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: 0,
      gender: "",
      birthday: "",
    },
    address: Address = {
      state: "",
      region: "",
      city: "",
    },
    friendRequests: string[] = [],
    sentFriendRequests: string[] = [],
    friends: string[] = [],
    profileImage: string = "",
    coverImage: string = "",
    postsAlbum: string[] = [],
    profileAlbum: string[] = [],
    coverAlbum: string[] = [],
    bio: string = "",
    posts: string[] = [],
    likedPosts: string[] = [],
    isActive: boolean = false,
    lastSeen: Date = new Date(),
    photos: Photos = {
      profileImage: "",
      coverImage: "",
    }
  ) {
    this._id = _id;
    this.userDetails = userDetails;
    this.address = address;
    this.friendRequests = friendRequests;
    this.sentFriendRequests = sentFriendRequests;
    this.friends = friends;
    this.profileImage = profileImage;
    this.coverImage = coverImage;
    this.postsAlbum = postsAlbum;
    this.profileAlbum = profileAlbum;
    this.coverAlbum = coverAlbum;
    this.bio = bio;
    this.posts = posts;
    this.likedPosts = likedPosts;
    this.isActive = isActive;
    this.lastSeen = lastSeen;
    this.photos = photos;
  }
  
}
