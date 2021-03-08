import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const PostList: FC = () => {
  const [posts, setPosts] = useState<{ title: string; id: string }[]>([]);

  const getPostsCallback = useCallback(async () => {
    const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const posts: { [key: string]: { title: string; id: string } } = res.data;

    const normalizedPosts = Object.values(posts);

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  // ADDING CLASSES HERE
  return (
    <div className="">
      {posts.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  );
};

export default PostList;
