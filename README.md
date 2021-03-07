# REACT PROJECT SETUP

1) POST CREATION FORM

2) LIST OF POSTS

3) COMMENTS FORM ON POST

4) COMMENT LISTI ON POST

## WILL BE USING axios FOR NETWORK REQUESTS

- `yarn add axios`

# SETUP

- `touch src/App.tsx`

```tsx
import React, { FC } from "react";

const App: FC = () => {
  return <div>Blog App!</div>;
};

export default App;

```

- `touch src/index.tsx`

```tsx
import React from "react";
import ReactDom from "react-dom";

import App from "./App";

ReactDom.render(<App />, document.getElementById("root"));
```
