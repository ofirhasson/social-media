export var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["Created"] = 201] = "Created";
    StatusCode[StatusCode["NoContent"] = 204] = "NoContent";
    StatusCode[StatusCode["BadRequest"] = 400] = "BadRequest";
    StatusCode[StatusCode["Unauthorized"] = 401] = "Unauthorized";
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
})(StatusCode || (StatusCode = {}));
export var RoleModel;
(function (RoleModel) {
    RoleModel[RoleModel["Admin"] = 1] = "Admin";
    RoleModel[RoleModel["User"] = 2] = "User";
})(RoleModel || (RoleModel = {}));
export var LikeTarget;
(function (LikeTarget) {
    LikeTarget["Post"] = "post";
    LikeTarget["Comment"] = "comment";
    LikeTarget["Reply"] = "reply";
})(LikeTarget || (LikeTarget = {}));
export var ImageType;
(function (ImageType) {
    ImageType["ProfileImage"] = "profileImage";
    ImageType["CoverImage"] = "coverImage";
    ImageType["ImageName"] = "ImageName";
})(ImageType || (ImageType = {}));
export var PrivacyOptions;
(function (PrivacyOptions) {
    PrivacyOptions["Public"] = "public";
    PrivacyOptions["Friends"] = "friends";
    PrivacyOptions["Private"] = "private";
})(PrivacyOptions || (PrivacyOptions = {}));
