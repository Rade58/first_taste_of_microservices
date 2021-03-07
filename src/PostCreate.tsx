import React, { FC, useState } from "react";

const PostCreate: FC = () => {
  const [title, setTitle] = useState<string>("");

  return (
    <div>
      <form>
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
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
