import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";

import CommentList from "./CommentList";

const PostList: FC = () => {
  // POSTS NOW HAVE MORE DATA ON THEM
  // const [posts, setPosts] = useState<{ title: string; id: string }[]>([]);
  // THEY HAVE COMMENTS ON THEM TOO
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
    // INSTEAD OF POSTS SERVICE
    /* const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    */
    // I'LL HIT QUERY SERVICE
    const res = await axios.get("http://localhost:4002/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // JUST ADDING COMMENTS TO TYPE (TYPESCRIPT)
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
      {/* RETRUCTURING ALSO COMMENTS */}
      {posts.map(({ id, title, comments }) => (
        <div
          key={id}
          className="card d-flex flex-row flex-wrap justify-content-between"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{title}</h3>
            <CommentCreate postId={id} />
            {/* NEED TO DO PROP DRILLING TO GIVE COMMENTS
            TO COMMENTS LIST */}
            <CommentList postId={id} comments={comments} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
