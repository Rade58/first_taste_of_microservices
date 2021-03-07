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

    // normalization
    const normalizedPosts = [];

    for (const key in posts) {
      normalizedPosts.push(posts[key]);
    }

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {posts.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  );
};

export default PostList;
