# HITTING QUERY SERVICE FROM THE REACT APP

I NEED TO MODIFY REACT CODE

NOW I NEED TO HIT `/posts` ROUTE OG THE QUERY SERVICE, BECAUSE, LIKE I SAID BEFORE, I WANT TO GET ALL POSTS ND RELATED COMMENTS WITH ONE NETWORK REQUEST

**IN TERMS OF GET REQUEST, I NEED TO REPLACE THAT `/posts` (POSTS SERVICE) REQUEST, AND REPLACE REQUEST TOWARDS `/comments` (COMMENTS REQUESTS WERE GETTING STACKED TO ENOURMOUS NUMBER OF REQUESTS (ONE PER POST) THAT IS WHY I'M DOING THIS IN A FIRST PLACE)**

## LETS FIRST GET DATA

- `code src/PostList.tsx`

```js

```

## MEYBE I DIDN'T REMIND YOU, BUT POSTS AND COMMENTS SERVICE AE STILL OK

THEY ARE STILL IN CHARGE OF CREATING POSTS AND COMMENTS

AND REACT APP WILL REACH TO THOSE SERVICES DIRECTLY

IN THIS BRANCH WE WERE ONLY CHENGING "GET" PART OF THINGS
