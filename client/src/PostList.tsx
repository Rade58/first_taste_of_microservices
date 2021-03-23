import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";

import CommentList from "./CommentList";

const PostList: FC = () => {
  const [posts, setPosts] = useState<
    {
      id: string;
      title: string;
      comments: {
        id: string;
        content: string;
        postId: string;
        status: string;
      }[];
    }[]
  >([]);

  const getPostsCallback = useCallback(async () => {
    // UMESTO OVOGA
    // const res = await axios.get("http://localhost:4002/posts", {
    // PISEM OVO
    const res = await axios.get("http://myblog.com/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const posts: {
      [key: string]: {
        title: string;
        id: string;
        comments: {
          id: string;
          content: string;
          postId: string;
          status: string;
        }[];
      };
    } = res.data;

    const normalizedPosts = Object.values(posts);

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {posts.map(({ id, title, comments }) => (
        <div
          key={id}
          className="card d-flex flex-row flex-wrap justify-content-between"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{title}</h3>
            <CommentCreate postId={id} />

            <CommentList postId={id} comments={comments} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
