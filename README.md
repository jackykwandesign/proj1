# testGraphQL
1. clone the file
2. npm install
3. npm run dev

# graphQL playground: http://localhost:4000/

## Query and mutation example

    mutation AddPostAgain($input: AddPostInput!) {
      addPost(input: $input) {
        id
        content
        title
        author {
          name
        }
      }
    }
    query checkPost{
      user(name:"Fong"){
        posts{
          id
          title
          content
        }
      }
    }
## variable, Input Object Type, type in variable at left corner

    {
      "input":  {
        "title": "Input Object Is Awesome",
        "content": "ZZZZZZZZZZZZZ"
      }
    }
## the output should be like this
### checkPost

    {
      "data": {
        "user": {
          "posts": [
            {
              "id": "1",
              "title": "Hello World!",
              "content": "This is my first post."
            },
            {
              "id": "3",
              "title": "I Love U",
              "content": "Here's my second post!"
            }
          ]
        }
      }
    }
### AddPostAgain

    {
      "data": {
        "addPost": {
          "id": "4",
          "content": "ZZZZZZZZZZZZZ",
          "title": "Input Object Is Awesome",
          "author": {
            "name": "Fong"
          }
        }
      }
    }
### checkPost after AddPostAgain

    {
      "data": {
        "user": {
          "posts": [
            {
              "id": "1",
              "title": "Hello World!",
              "content": "This is my first post."
            },
            {
              "id": "3",
              "title": "I Love U",
              "content": "Here's my second post!"
            },
            {
              "id": "4",
              "title": "Input Object Is Awesome",
              "content": "ZZZZZZZZZZZZZ"
            }
          ]
        }
      }
    }
## console.log will also show when received AddPostAgain

    arguments are:
    { input:
       { title: 'Input Object Is Awesome', content: 'ZZZZZZZZZZZZZ' } }
    Title: Input Object Is Awesome
    Content: ZZZZZZZZZZZZZ

