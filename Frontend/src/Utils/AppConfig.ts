class AppConfig {
    // Backend urls:
    private readonly prefix = process.env.REACT_APP_BACKEND_URL + "/api/";

    public readonly postImageUrl = this.prefix + "social-media/images/posts-images/"

    public readonly registerUrl = `${this.prefix}register/`;
    public readonly loginUrl = `${this.prefix}login/`;
    public readonly usersUrl = `${this.prefix}users/`;
    public readonly postsUrl = `${this.prefix}posts/`;
    public readonly commentUrl = `${this.prefix}comment/`;
    public readonly repliesUrl = `${this.prefix}reply/`;
    public readonly likesUrl = `${this.prefix}like/`;

    //Axios options:
    public readonly axiosOptions = {
        headers: {
            // Tell axios to also send the image:
            "Content-Type": "multipart/form-data", // We're sending also files.
        },
    };
}

export const appConfig = new AppConfig();
