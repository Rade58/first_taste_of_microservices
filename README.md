# COMMENT CREATE COMPONENT AND COMMENTS LIST COMMPONENT

- `touch src/CommentCreate.tsx`

```tsx
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

```

- `touch src/CommentList.tsx`

```tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const CommentList: FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<{ id: string; content: string }[]>(
    []
  );

  const getCommentsByPostIdCallback = useCallback(async () => {
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
  }, [setComments]);

  useEffect(() => {
    getCommentsByPostIdCallback();
  }, []);

  return (
    <ul>
      {comments.map(({ id, content }) => (
        <li key={id}>{content}</li>
      ))}
    </ul>
  );
};

export default CommentList;
```

# MANUAL TESTING

- `yarn start`

- `cd posts` `yarn start`

- `cd comments` `yarns start`

# NOTES

YOU CAN CREATE POST, BUT IT IS GOING TO BE LISTED (FETCHED) ONLY WHEN YOU RELOAD

YOU CAN CREATE COMMENTS, BUT IT IS ONLY GOING TO BE LISTED (FETCHED) WHEN YOU RELOAD

POTENTIALY IF YOU HAVE 20 POSTS, YOU WILL HAVE ONE NETWORK REQUEST FOR ALL OF POSTS, AND THAT IS REASONABLE

BUT YOU HAVE EFFICIENCY PROBLEM WITH NETWORK REQUEST FOR COMMENTS

POTENTIALY IF EVERY POST HAS LIST OF COMMENTS, THAT MEANS 20 + NETWORK REQUESTF FOR COMMENTS (**THIS IS A MAIN ISSUE**)

