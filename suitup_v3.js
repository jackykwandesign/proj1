const {ApolloServer,gql} = require('apollo-server');
//activate server class, provide web aplication by express bg
//gql let use use graphQL in Javascript

//fake data
const meId = 1;
const hashtags = [
  {
    id: 12,
    name: 'hashtag_name_1',
  },
  {
    id: 2,
    name: 'hashtag_name_2',
  },
  {
    id: 3,
    name: 'hashtag_name_3',
  },
  {
    id: 4,
    name: 'hashtag_name_4',
  },
  {
    id: 5,
    name: 'hashtag_name_5',
  },
  {
    id: 6,
    name: 'hashtag_name_6',
  }
];

var all_clothes_c = [
  {
    id: 2,
    name: 'clothes_name_1',
    hashtagIds:[1,2],
    s:0,
  },
  {
    id: 3,
    name: 'clothes_name_2',
    hashtagIds:[2,3],
    s:0,

  },
  {
    id: 4,
    name: 'clothes_name_3',
    hashtagIds:[3,4],
    s:0,
  },
  {
    id: 5,
    name: 'clothes_name_4',
    hashtagIds:[4,5],
    s:0,

  },
  {
    id: 6,
    name: 'clothes_name_5',
    hashtagIds:[5,6],
    s:0,
  },
  {
    id: 7,
    name: 'clothes_name_6',
    hashtagIds:[6,1],
    s:0,
  }

];
const design_r_c = [
	{
		id:11,
		beginHashtagid: 1,
		hashtags_r:[2,3,4],
		ops:[0,1,0],
		score:10,
	},{
                id:22,
                beginHashtagid: 1,
                hashtags_r:[3,4,5],
                ops:[0,1,0],
                score:20,
        },{
                id:33,
                beginHashtagid: 1,
                hashtags_r:[2,3,4],
                ops:[0,1,0],
                score:30,
        },
	{
                id:44,
                beginHashtagid: 1,
                hashtags_r:[2,5,6],
                ops:[0,1,0],
                score:40,
        },
	{
                id:55,
                beginHashtagid: 1,
                hashtags_r:[3,5,6],
                ops:[0,1,0],
                score:50,
        },


];

//define Schema of GraphQL
const typeDefs = gql`
        type Hashtag{
                id:ID!
                name:String!
	        taged_clothes:[Clothes]	
        }
        type Clothes{
                id:ID!
                name: String!
                hashtags: [Hashtag]
        }
        type Design_r{
		id:ID!
		beginHashtag:Hashtag!
		hashtags_r:[Hashtag]
		ops:[Int]
		score:Int!
	}
	type Query{
                hello:String
                all_clothes:[Clothes]
                clothes_name(name: String!):Clothes
		clothes(id:ID!):Clothes
                hashtags:[Hashtag]
                hashtag(id:ID!):Hashtag
		clothesbyHashtagId(id:ID!):[Clothes]
		design:[Design_r]
		getsuggest(c_id:ID!,req_id:ID!):Clothes
				
        }
	type Mutation{
		addclothes(name:String!):Clothes
		addHashtag(name:String!):Hashtag
		addHashtagbyClothesId(id:ID!,id_c:ID!):Clothes
		removeHashtagbyClothesId(id:ID!,id_c:ID!):Clothes
		addDesign_r(id:ID!,tagid:ID!,op:Int!):Design_r
		deleteDesign(id:ID!):Int
		newDesign(hashId:Int!,input_score:Int!):Design_r
	}
	
`;


//useful function prevent code redundancy

const findClothesByClothesId = id => all_clothes_c.find(clothes => clothes.id === Number(id));
const filterAllClothesByHashtagId = hashtagId => all_clothes_c.filter(clothes => clothes.hashtagIds.find(ids => ids === Number(hashtagId)));
const filterHashtagsByHashtagIds = hashtagIds => hashtags.filter(hashtag => hashtagIds.includes(hashtag.id));
const findClothesByName = name => all_clothes_c.find(clothes => clothes.name === name);
const findHashtagByHashtagId = hashtagId => hashtags.find(hashtag => hashtag.id === Number(hashtagId));
const filterGivenlistByHashtagId = (clotheslist,hashtagsId) => clotheslist.filter(clothes => clothes.hashtagIds.find(ids => ids === Number(hashtagsId)));
function filterGetAndListByGivenDesignList(designlist){
    let or_list = [];
    designlist.forEach(function (design,design_i){   
        let and_list = [];
        and_list.push(design.beginHashtagid);
        for(let i in design.hashtags_r){
            if (design.ops[i] === 1){
                or_list.push({list1:and_list,design_id:design.id,end:false});
                and_list = [];
                and_list.push(design.hashtags_r[i]);            
            }else{
                and_list.push(design.hashtags_r[i]);
            }
      	    if((design.hashtags_r.length - 1) == i ){
                or_list.push({list1:and_list,design_id:design.id,end:true});
            }
        }
    });
    return or_list;
};
function haveSameTag(oneList,givenClothes){
    let c_tag = givenClothes.hashtagIds;
    let result = true;
    c_tag.forEach(function(element){
        if(oneList.indexOf(element)>-1){
        }else{
            result = false;
        }
    });
    if (result){
        return true;
    }else{
        return false;
    }
}
function filterGivenlistByHashtagIds(clotheslist,hashtagIds){
	let clothes_f = clotheslist;
	hashtagIds.foreach(function (hash_tag,i){
		clothes_f = filterGivenlistByHashtagId(clothes_f,hash_tag);
	});
	return clothes_f;
};

function filterDesignByClothes(designlist,givenClothes){
    let c = filterGetAndListByGivenDesignList(designlist);
    let ids = [];
    for (let i = 0;i < c.length;++i){
        if (haveSameTag(c[i].list1,givenClothes)){
            if (ids.indexOf(c[i].design_id)<0){
                ids.push(c[i].design_id);
            }            
        }
    }
    let result = filterDesignByDesignids(designlist,ids);
    return result;
};

const findDesignByid = input => design_r_c.find(design => design.id === Number(input));
function filterDesignByDesignids(designlist,ids){
    let r = [];
    let temp_design;
       ids.forEach(function (id){
       temp_design = findDesignByid(id);
       if (r.indexOf(temp_design)<0){
            r.push(temp_design);
       }    
    });
    return r;
};

const resolvers = {
        Query:{
                hello:() => 'world',
                all_clothes: () => all_clothes_c,
		clothes_name: (parent, {name}, context) => findClothesByName(name),
                clothes: (parent, {id}, context) => findClothesByClothesId(id),
                hashtags: () => hashtags,
                hashtag: (parent, {id}, context) => findHashtagByHashtagId(id),
		clothesbyHashtagId:(parent,{id},context) => filterAllClothesByHashtagId(id),
		design:() => design_r_c,
		getsuggest:(parent,args,context) => {
			const {c_id,req_id} = args;
			let clothes_list = filterAllClothesByHashtagId(req_id);
			let given_c = findClothesByClothesId(c_id);
			let filted_design_with_given_clothes = filterDesignByClothes(design_r_c,given_c);
			clothes_list.forEach(function (thisClothes){
				thisClothes.s = 0;
                               let related_d = filterDesignByClothes(filted_design_with_given_clothes,thisClothes);
			       if (related_d.length >0){
			       		related_d.forEach(function (design){
						thisClothes.s = thisClothes.s + design.score;
					}
			       }
                        });
			return clothes_list;
		},
        },
        Clothes:{
                hashtags: (parent, args, context) => {
			const {hashtagIds} = parent;
			return hashtags.filter(hashtag => hashtagIds.includes(hashtag.id));
		}
                 
        },
        Hashtag:{

        },
	Design_r:{
		beginHashtag:(parent, args, context) => {
                        const {id} = parent;
                        let design1 = findDesignByid(id);
			let beginid = design1.beginHashtagid;
			let tag = findHashtagByHashtagId(beginid);
			if (!tag) throw new Error(`hashtag ${id} Not Exists`);
			return tag;
                },
 

		hashtags_r:(parent,args,context)=>{
			const {id} = parent;
                        let design1 = findDesignByid(id);
			let tags = design1.hashtags_r;
			let taglist = [];
			tags.forEach(function (tagsid){
				taglist.push(findHashtagByHashtagId(tagsid));
			});
			return taglist;

		},
	
		ops:(parent,args,context)=>{
			const{ops} = parent;
			return ops; 
		},
		
	},

	Mutation:{
		addclothes:(parent,args,context) => {
			const{name} = args;
			all_clothes_c.push({
				id:all_clothes_c[all_clothes_c.length - 1].id +1,
				name,
				hashtagIds:[],
				s:0
			});
			return all_clothes_c[all_clothes_c.length - 1];
		},
		addHashtag:(parent,args,context) =>{
			const{name} = args;
			let name_input = name;
			let t_id = hashtags[hashtags.length - 1].id + 1;
			hashtags.push({
				id:t_id,
				name:name_input
			}); 
			return hashtags[hashtags.length - 1];
		},
		addHashtagbyClothesId:(parent,args,context) =>{
                        const{id,id_c} = args;
			let found_c = findClothesByClothesId(id_c);
			if(!found_c){
				throw new Error(`Clothes id:${id_c} Not Exists`);
			};
			let hash = findHashtagByHashtagId(id);
			if(!hash){
				 throw new Error(`Hashtag id:${id} Not Exists`);
			};
			found_c.hashtagIds.push(Number(id));
			return found_c; 
		},
		removeHashtagbyClothesId:(parent,args,context) =>{
			const{id,id_c} = args;
			let found_c = findClothesByClothesId(id_c);
			if(!found_c){
                                throw new Error(`Clothes id:${id_c} Not Exists`);
                        };
			let hashIdList = found_c.hashtagIds;
			if (hashIdList.includes(Number(id))){
				let index = hashIdList.indexOf(Number(id));
				if (index > -1){
					hashIdList.splice(index, 1);
				}else{
					throw new Error(`Clothes id:${id_c} do_Not include hashtag id:${id} and include_fail`);
				}
			}else{
				throw new Error(`Clothes id:${id_c} do_Not include hashtag id:${id}`);
			};
			return found_c;

		},
		addDesign_r:(parent,args,context) =>{
                        const{id,tagid,op} = args;
			let found_d = findDesignByid(id);
			if(!found_d){
				 throw new Error(`Design id:${id} Not Exists`);
			};
			found_d.hashtags_r.push(Number(tagid));
			found_d.ops.push(Number(op));
			return found_d;
		},
		deleteDesign:(parent,args,context) =>{
                        const{id} = args;
			let found_d = findDesignByid(id);
                        if(!found_d){
                                 throw new Error(`Design id:${id} Not Exists`);
                        };
			let index = design_r_c.indexOf(found_d);
			design_r_c.splice(index, 1);
                        return design_r_c.length;

		},
		newDesign:(parent,args,context) =>{
                        const{hashId,input_score} = args;
			
			design_r_c.push({
				id : design_r_c[design_r_c.length - 1].id +1,
				beginHashtagid:Number(hashId),
				hashtags_r:[],
				ops:[],
				score:input_score,
			});
			return  design_r_c[design_r_c.length - 1];
		},
        },


};

const server = new ApolloServer({
        typeDefs,
        resolvers
});

server.listen(3100).then(({url}) => {
                console.log(`? Server ready at ${url}`);
        }
);

