import React, { FC, useCallback, useState } from "react";
import axios from "axios";

const CommentCreate: FC<{ postId: string }> = ({ postId }) => {
  const [content, setContent] = useState<string>("");

  const createNewCommentForPost = useCallback(async () => {
    const res = await axios.post(
      `http://localhost:4001/posts/${postId}/comments`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newComment = res.data;
  }, [content]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNewCommentForPost();
          setContent("");
        }}
      >
        <div className="form-group">
          <label>
            New Comment
            <input
              className="form-control"
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </label>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
