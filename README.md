# POST LIST

- `touch src/PostList.tsx`

SEE IT FOR YOURSELF

NOTHING FANCY, USING axios TO FETCH ALL POSTS

NORMALIZATION OF POSTS TO ARRAY UPON RESPONSE IS USED, BECAUSE I AM GETTING DICTIONARY FROM 

```tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const PostList: FC = () => {
  const [posts, setPosts] = useState<{ title: string; id: string }[]>([]);

  const getPostsCallback = useCallback(async () => {
    const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const posts: { [key: string]: { title: string; id: string } } = res.data;

    // normalization
    const normalizedPosts = [];

    for (const key in posts) {
      normalizedPosts.push(posts[key]);
    }

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {posts.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  );
};

export default PostList;
```

# NORMALIZATION WITH `Object.values(postsDictionary)`

JUST A LITTLE CORRRECTION

BUT I DON'T THINK IT GIVES ANYTHING NEW BECAUSE ITERATION IS PROBABLUY HAPPENING UNDER THE HOOD

- `code src/PostList.tsx`

```tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

const PostList: FC = () => {
  const [posts, setPosts] = useState<{ title: string; id: string }[]>([]);

  const getPostsCallback = useCallback(async () => {
    const res = await axios.get("http://localhost:4000/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const posts: { [key: string]: { title: string; id: string } } = res.data;

    /* // INSTEAD OF THIS
    // normalization
    const normalizedPosts = [];

    for (const key in posts) {
      normalizedPosts.push(posts[key]);
    } */

    // setPosts(normalizedPosts);

    // DO THIS

    const normalizedPosts = Object.values(posts);

    setPosts(normalizedPosts);
    //
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {posts.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  );
};

export default PostList;

```

## MANUAL TEST

JUST CREATE FEW POST WITH A FORM

- `yarn start`

- `cd posts` `yarn start`

YOU CAN CREATE POSTS

REALOAD, AND NEW POST IS DISPLAYED WITH OLD ONES
