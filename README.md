# REQUEST MINIMIZATION STRATEGIES

IN YOUR CURRENT PROJECT

YOU HAVE POSTS

ON THEM YOU HAVE COMMENTS

YOU HAVE **1 NETWOR REQUEST FOR LIST OF POSTS ,EHRN POST LIST COMPONENT MOUNTS**

***

PROBLEM: **EVERY POST HAS THEIR OWN NETWORK REQUEST FOR COMMENTS**; **THAT MEANS IF YOU HAVE 20 POSTS, THAT IS 20 NEW NETWORK REQUEST FOR COMMENTS, ON MOUNTING OFCOURSE**

INCREDIBLE INEFFICIENCY

***

I WANT TO FIGURE OUT HOW COULD EVERYTHING BE MORE EFFICIENT

I WOULD LIKE CONDENSE EVERYTING INTO ONE REQUEST

# POSIBLE SOLUTION 1: MONOLIT WAY

SOMEHOW EMBEDING COMMENTS INSIDE A POST WHEN YOU FETCH FOR POSTS

BUT THAT IS MONOLIT WAY I DON'T WANT TO USE

I WANT TO USE MICROSERVICES

# POSIBLE SOLUTION 1: SYNC COMMUNICATION

MONOLIT WAY WHERE YOU ADD `?comments=true` QUERY STRING (WHEN YOU FETCH FOR POSTS)

THAT MEANS YOUR POST SERVICE WOULD COMUNICATE WITH YOUR COMMENTS SERVICE TO FETCH COMMENTS

AND IN RESPONSE TO FRONTEND YOU WOULD GET POSTS WITH COMMENTS

SO YOU WOULD NEED TO ADD CODE TO POST SERVICE TO REACH OUT FOR COMMENTS

THIS IS BAD BECAUSE YOU HAVE DEPENDANCY BETWEEN SERVICES AND MANY MORE THINGS ARE BAD, YOU CAN CHECK THOSE LISTED THINGS WHEN WE TALK ABOUT SYNC COMMUNICATION
