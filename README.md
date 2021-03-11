# HITTING QUERY SERVICE FROM THE REACT APP

I NEED TO MODIFY REACT CODE

NOW I NEED TO HIT `/posts` ROUTE OG THE QUERY SERVICE, BECAUSE, LIKE I SAID BEFORE, I WANT TO GET ALL POSTS ND RELATED COMMENTS WITH ONE NETWORK REQUEST

**IN TERMS OF GET REQUEST, I NEED TO REPLACE THAT `/posts` (POSTS SERVICE) REQUEST, AND REPLACE REQUEST TOWARDS `/comments` (COMMENTS REQUESTS WERE GETTING STACKED TO ENOURMOUS NUMBER OF REQUESTS (ONE PER POST) THAT IS WHY I'M DOING THIS IN A FIRST PLACE)**

## LETS FIRST GET DATA

- `code src/PostList.tsx`

```js
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";

import CommentList from "./CommentList";

const PostList: FC = () => {
  // POSTS NOW HAVE MORE DATA ON THEM
  // const [posts, setPosts] = useState<{ title: string; id: string }[]>([]);
  // THEY HAVE COMMENTS ON THEM TOO
  const [posts, setPosts] = useState<
    {
      id: string;
      title: string;
      comments: { id: string; content: string; postId: string }[];
    }[]
  >([]);

  const getPostsCallback = useCallback(async () => {
    // INSTEAD OF POSTS SERVICE
    /* const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    */
    // I'LL HIT QUERY SERVICE
    const res = await axios.get("http://localhost:4002/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // JUST ADDING COMMENTS TO TYPE (TYPESCRIPT)
    const posts: {
      [key: string]: {
        title: string;
        id: string;
        comments: { id: string; content: string; postId: string }[];
      };
    } = res.data;

    const normalizedPosts = Object.values(posts);

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {/* RETRUCTURING ALSO COMMENTS */}
      {posts.map(({ id, title, comments }) => (
        <div
          key={id}
          className="card d-flex flex-row flex-wrap justify-content-between"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{title}</h3>
            <CommentCreate postId={id} />
            {/* NEED TO DO PROP DRILLING TO GIVE COMMENTS
            TO COMMENT LIST COMPONENT */}
            <CommentList postId={id} comments={comments} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
```

## I NEED TO CHANGE COMMENT LIST COMPONENT BECAUSE NOW IT SHOUD ACCEPT COMMENTS AS A PROP

- `code src/CommentList.tsx`

```tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

// EXTENDING PROP TYPES, TO INCLUDE COMMENTS ARRAY

const CommentList: FC<{
  postId: string;
  comments: { id: string; content: string; postId: string }[];
}> = ({ postId, comments }) => {
  // NO NEED FOR THIS STATE
  /* const [comments, setComments] = useState<{ id: string; content: string }[]>(
    []
  );
 */

  // NO NEED TO HIT COMMENTS SERVICE WITH
  /* const getCommentsByPostIdCallback = useCallback(async () => {
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
  }, [setComments]); */

  /* useEffect(() => {
    getCommentsByPostIdCallback();
  }, []); */

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

## YOU CAN TEST THIS

SAME THING YOU DID BEFORE, IN PREVIOUS BRANCHES

JUST ENTER ALL SERVICES FOLDER AND START THEM, SAME WITH THE EVENT BUS SERVER

START THE REACT APP

MAKE FEW POSTS RELOAD, ADD FEW COMMENTS, RELOAD

AND YOU'LL SE THAT EVERYTHING IS WORKING

## MEYBE I DIDN'T REMIND YOU, BUT POSTS AND COMMENTS SERVICE AE STILL OK

THEY ARE STILL IN CHARGE OF CREATING POSTS AND COMMENTS

AND REACT APP WILL REACH TO THOSE SERVICES DIRECTLY

IN THIS BRANCH WE WERE ONLY CHENGING "GET" PART OF THINGS
