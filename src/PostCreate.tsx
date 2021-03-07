import React, { FC, useState, useCallback } from "react";
import axios from "axios";

const PostCreate: FC = () => {
  const [title, setTitle] = useState<string>("");

  const submitCallback = useCallback(async () => {
    const createdPost = await axios.post(
      "http://localhost:4000/posts",
      {
        title,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log({ createdPost });
  }, [title]);

  return (
    <div>
      <form
        onSubmit={() => {
          submitCallback();
        }}
      >
        <div className="form-group">
          <label htmlFor="title-input">Title</label>
          <input
            onChange={(e) => {
              // debugger;
              setTitle(e.target.value);
            }}
            value={title}
            type="text"
            id="title-input"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
