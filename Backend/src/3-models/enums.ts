export enum StatusCode {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500
}

export enum RoleModel {
    Admin = 1,
    User = 2
}


export enum LikeTarget {
   Post = "post",
   Comment = "comment",
   Reply = "reply"
}

export enum ImageType {
    ProfileImage = "profileImage",
    CoverImage = "coverImage",
    ImageName = "ImageName",
}

export enum PrivacyOptions {
    Public = "public",
    Friends = "friends",
    Private = "private",
}
