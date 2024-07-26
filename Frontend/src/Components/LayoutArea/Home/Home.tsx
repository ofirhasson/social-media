import { useEffect } from "react";
import { useAppSelector } from "../../../Redux/Store";
import "./Home.css";
import { notify } from "../../../Utils/Notify";
import { postsService } from "../../../Services/PostsService";
import { PostCard } from "../../Cards/PostCard/PostCard";

export function Home(): JSX.Element {
  const posts = useAppSelector((state) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await postsService.getAllPostsByTargetUser({
          userId: "669fb41dcde017f450890b26",
        });
        console.log(posts);
      } catch (err: any) {
        notify.error(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="mb-10">
      <div className="pb-10">
      {posts?.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
        </div>  
    </div>
  );
}
