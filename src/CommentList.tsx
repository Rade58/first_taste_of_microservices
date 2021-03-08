import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const CommentCreate: FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<{ id: string; content: string }[]>(
    []
  );

  const getCommentsByPostIdCallback = useCallback(async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: {
      id: string;
      comments: { id: string; content: string }[];
    } = res.data;

    // console.log({ data });

    setComments(data.comments);
    //
  }, [setComments]);

  useEffect(() => {
    getCommentsByPostIdCallback();
  }, []);

  return null;
};

export default CommentCreate;
