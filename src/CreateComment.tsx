import React, { FC, useCallback, useState } from "react";
import axios from "axios";

const CreateComment: FC<{ postId: string }> = ({ postId }) => {
  const [content, setContent] = useState<string>("");

  const createNewCommentForPost = useCallback(async () => {
    //
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
