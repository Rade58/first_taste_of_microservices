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

  // ADDING BOOTSTRAP CLASSES, CHANGING TAGS A BIT
  // ADDING SOME STYLES
  return (
    <div>
      {posts.map(({ id, title }) => (
        <div
          key={id}
          className="card d-flex flex-row flex-wrap justify-content-between"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
