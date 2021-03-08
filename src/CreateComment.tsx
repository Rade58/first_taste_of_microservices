import React, { FC, useCallback, useState } from "react";
import axios from "axios";

const CreateComment: FC<{ postId: string }> = ({ postId }) => {
  const [content, setContent] = useState<string>("");

  const createNewCommentForPost = useCallback(async () => {
    const res = await axios.post(
      `http://localhost:4001/posts/${postId}/comments`
    );

    const newPost = res.data;
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNewCommentForPost();
        }}
      >
        <h4>Add Comment</h4>
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        {/* -------- -------- */}
        {/* -------- -------- */}
      </form>
    </div>
  );
};

export default CreateComment;
