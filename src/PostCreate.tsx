import React, { FC } from "react";

const PostCreate: FC = () => {
  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="title-input">Title</label>
          <input type="text" id="title-input" className="form-control" />
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
