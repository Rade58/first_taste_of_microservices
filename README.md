# SOME FIXES

I REALLY DON'T KNOW WHY I HAVE INCONSISENCIES

MAYBE I OVERLOOKED SOMETHING

OR PROBLEM IS BECAUSE I'M DOING STUFF IN MEMORY

**EVENT BUS IS FAILING FOR SOME REASON, MEYBE HE IS A PROBLEM**


# WE CAN TEST THIS NOW

NOT THROUGH REACT APP (IN A SENSE THAT WE ARE NOT RENDERING ANYTHING BASED ON status)

BUT WE CAN START ALL SERVICES AND START A REACT APP AND THEN WE CAN MAKE FEW POST AND COMMENTS

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

I MADE SOME POSTS AND COMMENTS (**IMPORTANT THING IS THAT SOME OF THE COMMENTS SHOUD HAVE WORDS "`foobar`" AND "`bazmod`"**)

**GETTING ALL POSTS WITH httpie**

- `http GET :4002/posts`

## AFTER THIS, LETS MODIFY REACT APP TO DYSPLAYED BASED ON MODERATION STATUS 
