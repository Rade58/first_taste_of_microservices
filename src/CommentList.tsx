import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const CommentList: FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<{ id: string; content: string }[]>(
    []
  );

  const getCommentsByPostIdCallback = useCallback(async () => {
    try {
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

      console.log({ data });

      setComments(data.comments);
    } catch (error) {
      console.log(error, `no commoents for post id: ${postId}`);
    }
    //
  }, [setComments]);

  useEffect(() => {
    getCommentsByPostIdCallback();
  }, []);

  return (
    <ul>
      {comments.map(({ id, content }) => (
        <li key={id}>{content}</li>
      ))}
    </ul>
  );
};

export default CommentList;
