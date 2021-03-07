# POST CREATE COMPONENT

WILL BE USING BOOTSTRAP FOR STYLING

WILL LOAD IT FROM CDN

<https://getbootstrap.com/docs/5.0/getting-started/download/#cdn-via-jsdelivr>

LINK TAG WILL BE PLACED IN `public/index.html` HEAD SECTION (**DON'T PASTE SCRIPT TAG**)


## `PostCreate.tsx`

- `touch src/PostCreate.tsx`

```tsx
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
        // INSTEAD OF #  YOU USED e.preventDefault
        // action="#"
        onSubmit={(e) => {
          e.preventDefault();
          submitCallback();
          setTitle("");
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
```
