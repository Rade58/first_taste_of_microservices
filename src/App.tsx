import React, { FC } from "react";

import PostCreate from "./PostCreate";

const App: FC = () => {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
    </div>
  );
};

export default App;
