import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

// EXTENDING PROP TYPES, TO INCLUDE COMMENTS ARRAY

const CommentList: FC<{
  postId: string;
  comments: { id: string; content: string; postId: string; status: string }[];
}> = ({ postId, comments }) => {
  // NO NEED FOR THIS STATE
  /* const [comments, setComments] = useState<{ id: string; content: string }[]>(
    []
  );
 */

  // NO NEED TO HIT COMMENTS SERVICE WITH
  /* const getCommentsByPostIdCallback = useCallback(async () => {
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
  }, [setComments]); */

  /* useEffect(() => {
    getCommentsByPostIdCallback();
  }, []); */

  return (
    <ul>
      {comments.map(({ id, content, status }) => (
        <li key={id}>
          {content} ({status})
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
