const {ApolloServer,gql} = require('apollo-server');
//activate server class, provide web aplication by express bg
//gql let use use graphQL in Javascript

//fake data
const meId = 1;
const hashtags = [
  {
    id: 1,
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
		//given clothes id , req_tag_id
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
	designlist.forEach()
	
	
}
function filterGivenlistByHashtagIds(clotheslist,hashtagIds){
	let clothes_f = clotheslist;
	hashtagIds.foreach(function (hash_tag,i){
		clothes_f = filterGivenlistByHashtagId(clothes_f,hash_tag);
	});
	return clothes_f;
}

function filterDesignByClothes(designlist,givenClothes){
	
	
	
	
	
}
const findDesignByid = input => design_r_c.find(design => design.id === Number(input));

//resolver is function map of field in Schema
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
		getsuggest:(parent,args,context) = {
			const {c_id,req_id} = args;
			let clothes_list = filterAllClothesByHashtagId(req_id);
			let filted_design_with_given_clothes = 
			design_r_c.forEach(function (design){
                                
                                let and_list = [];
                                let or_list = [];
				let firsttag = design.beginHashtagid;
                                let start = 0;
  						
  				and_list.push(firsttag);
                                for(let i in design.hashtags_r){
                                  		
                                        if ((design.ops[i] === 1)|(design.hashtags_r.length-1 == i)){
                                       		if (i == design.hashtags_r.length-1){
                                                	and_list.push(design.hashtags_r.slice(start,i+1));
                                                }else{
                                                    and_list.push(design.hashtags_r.slice(start,i));
                                                }
                                                let clothesl = filterGivenlistByHashtagIds(clothes_list,and_list);
						or_list.push({list:and_list});
						if (clothesl.length < 1){
							
						}
						else{
							
						}
                                          	or_count = or_count+1;
                                                and_list = [];
                                                start = i;
                                                firsttag = design.hashtags_r[i];
                                        	
                                        }
                                }
                        });


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
				id:all_clothes_c.length +1,
				name,
				hashtagIds:[],
				s:0
			});
			return all_clothes_c[all_clothes_c.length - 1];
		},
const filterGivenlistByHashtagId = (clotheslist,hashtagsId) => clotheslist.filter(clothes => clothes.hashtagIds.find(ids => ids === Number(hashtagsId)));

const findDesignByid = input => design_r_c.find(design => design.id === Number(input));

//resolver is function map of field in Schema
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
		getsuggest:(parent,args,context) = {
			const {c_id,req_id} = args;
			let clothes_list = filterAllClothesByHashtagId(req_id);
			design_r_c.forEach(function (design){
                                let or_count = 0;
                                let and_list = [];
                                let firsttag = design.beginHashtagid;
                                let start = 0;
  						
  				and_list.push(firsttag);
                                for(let i in design.hashtags_r){
                                  		
                                        if ((design.ops[i] === 1)|(design.hashtags_r.length-1 == i)){
                                       		if (i == design.hashtags_r.length-1){
                                                	and_list.push(design.hashtags_r.slice(start,i+1));
                                                }else{
                                                    and_list.push(design.hashtags_r.slice(start,i));
                                                }
                                                let clothesl = filterGivenlistByHashtagId(clothes_list,and_list);
						//or_list.push(and_list);
						if (clothesl.length < 1){
							
						}
						else{
							
						}
                                          	or_count = or_count+1;
                                                and_list = [];
                                                start = i;
                                                firsttag = design.hashtags_r[i];
                                        	
                                        }
                                }
                        });


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
	
