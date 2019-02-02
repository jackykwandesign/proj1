# testGraphQL
1. clone the file
2. npm install
3. npm run dev

# graphQL playground: http://vmkwan.pod.hk:3100/
## Hello World
    query h{
        hello
    }
## query
    query allc{
        all_clothes{
          id
          name
          hashtags{
            id
            name
          }
        }
    }
    query allh{
        hashtags{
          id
          name
        }
    }
    query c_name{
      clothes_name(name: "Kevin"){
        id
        name
      }
    }
    query c_id{
      clothesbyHashtagId(id: 5){
        id
        name
      }
    }
    query alld{
      design{
        id
        beginHashtag{
          name
        }
        hashtags_r{
          id
          name
        }
        ops
        score
      }
    }
## query suggestion
    query sug{
      getsuggest(c_id:6,req_id:2){//clothes id and required tags id
        id
        name
        s
      }
    }
## mutation example

    mutation addc{
      addclothes(name:"added_c"){
        name
      }
    }
    mutation addh{
      addHashtag(name:"added_h"){
        name
      }
    }
    mutation addhahtoC{
      addHashtagbyClothesId(id:5,id_c:2){
        id
        name
        hashtags{
          id
          name
        }
      }
    }
    mutation rmhahtoC{
      removeHashtagbyClothesId(id:5,id_c:2){
        id
        name
        hashtags{
          id
          name
        }
      }
    }
    mutation addd{
      addDesign_r(id:11,tagid:4,op:0){
        id
        beginHashtag
        {
          id
          name
        }
        hashtags_r{
          id
          name
        }
        ops
        score
      }
    }
    mutation deld{
      deleteDesign(id:44)
    }
    mutation newd{
      newDesign(hashId:4,input_score:10){
        id
        beginHashtag{
          id
          name

        }
        hashtags_r{
          id
        }
        ops
        score
      }
    }
## variable, Input Object Type, type in variable at left corner

    {
      "input":  {
        "title": "Input Object Is Awesome",
        "content": "ZZZZZZZZZZZZZ"
      }
    }

## console.log will also show when received AddPostAgain

    arguments are:
    { input:
       { title: 'Input Object Is Awesome', content: 'ZZZZZZZZZZZZZ' } }
    Title: Input Object Is Awesome
    Content: ZZZZZZZZZZZZZ

