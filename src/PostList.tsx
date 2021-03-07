import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const PostList: FC = () => {
  const [posts, setPosts] = useState<{
    [key: string]: { title: string; id: string };
  }>({});

  const getPostsCallback = useCallback(async () => {
    const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    debugger;
    const posts: { [key: string]: { title: string; id: string } } = res.data;

    setPosts(posts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {() => {
        const postElements: ReactElement[] = [];

        for (const post in posts) {
          postElements.push(
            <div key={posts[post].id}>{posts[post].title}</div>
          );
        }

        return postElements;
      }}
    </div>
  );
};

export default PostList;
