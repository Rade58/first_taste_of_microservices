# DEBUGGING; MOSTLY FIXING TYPOS

I WON'T SHOW YOU WHAT I FIXED, YOU CAN SEE IT BY YOURSELF

MOSTLY I FIXED TYPOS IN THE EVENT TYPES (EVENT NAMES)

# I ALSO MODIFIED REACT APP TO DISPLAY `status` OF THE COMMENT

YOU CAN SEE THIS BY YOURSELD

I JUST SHOWED STATUS INSIDE BRACKETS

# WE CAN TEST THIS NOW

THROUGH REACT APP

ALSO YOU CAN DO IT WITH HTTPIE

WE CAN START ALL SERVICES AND START A REACT APP AND THEN WE CAN MAKE FEW POST AND COMMENTS

**AND THEN WE CAN EXECUTE MANUAL TEST BY SENDING REQUEST WITH `httpie` TO QUERY SERVICE**

- `yarn start`

NEW TERMINAL

- `cd posts` `yarn start`

NEW TERMINAL

- `cd comments` `yarn start`

NEW TERMINAL

- `cd query` `yarn start`

NEW TERMINAL

- `cd moderation` `yarn start`

NEW TERMINAL

- `cd event_bus` `yarn start`

I MADE SOME POSTS AND COMMENTS (**IMPORTANT THING IS THAT SOME OF THE COMMENTS SHOUD HAVE WORD "`foobar`"**)

**GETTING ALL POSTS WITH httpie**

- `http GET :4002/posts`

```json
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 784
Content-Type: application/json; charset=utf-8
Date: Sat, 13 Mar 2021 17:47:35 GMT
ETag: W/"310-RocsVPa2cf/PGYmbCufo3rUYYzY"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "410d4712": {
        "comments": [
            {
                "content": "foobar friends",
                "id": "5ccbaaac",
                "status": "rejected"
            },
            {
                "content": "hello foobar",
                "id": "a46f79f2",
                "status": "rejected"
            }
        ],
        "id": "410d4712",
        "title": "Nick Mullen eatin Culen"
    },
    "766c0479": {
        "comments": [
            {
                "content": "nice",
                "id": "a47d9782",
                "status": "approved"
            },
            {
                "content": "foobar inteligence",
                "id": "4b2046d2",
                "status": "rejected"
            },
            {
                "content": "my name is john",
                "id": "c8105974",
                "status": "approved"
            }
        ],
        "id": "766c0479",
        "title": "Stavros Likes Bikes"
    },
    "bb4721f6": {
        "comments": [
            {
                "content": "hello",
                "id": "4bd37a7b",
                "status": "approved"
            },
            {
                "content": "foobar",
                "id": "5dbbb52b",
                "status": "rejected"
            },
            {
                "content": "foobar nice",
                "id": "aae5f34d",
                "status": "rejected"
            },
            {
                "content": "you are cool",
                "id": "72692e8f",
                "status": "approved"
            }
        ],
        "id": "bb4721f6",
        "title": "Adam Friedlan Incorporated"
    }
}

```

OK, COMMENTS WITH `foobar` WORD IN THEM ARE REJECTED, WHE ONES WITHOUT ARE APPROVED
