import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../../Redux/Store";
import { postsService } from "../../../../Services/PostsService";
import { notify } from "../../../../Utils/Notify";
import { useAppSelectors } from "../../../hooks/AppSelectors/useAppSelectors";
import { PostModel } from "../../../../Models/PostModel";

export const useHome = () => {

    const { user, userId, currentUser } = useAppSelectors()

    const [posts, setPosts] = useState<Map<string, PostModel>>(new Map());

    useMemo(() => {
        const fetchPosts = async () => {
            try {
                setPosts(await postsService.getAllPostsByTargetUser({
                    userId: userId,
                }));
            } catch (err: any) {
                notify.error(err);
            }
        };
        fetchPosts();
    }, []);



    return {
        user,
        posts,
        currentUser
    }
}