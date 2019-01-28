const {ApolloServer,gql} = require('apollo-server');
//activate server class, provide web aplication by express bg
//gql let use use graphQL in Javascript

//fake data
const users = [
	{
		id:1,
		name:'Fong',
		age:23,
		friendIds:[2,3],
		height:150,
		weight:60
	},
	{
		id:2,
		name:'Chong',
		age:1,
		friendIds:[1],
		height:175,
		weight:100


	},
	{
		id:3,
		name:'Henry',
		age:18,
		friendIds:[2],
		height:180,
		weight:70,
	}
];

const posts = [
  { id: 1, authorId: 1, title: "Hello World!", content: "This is my first post.", likeGiverIds: [2] },
  { id: 2, authorId: 2, title: "Good Night", content: "Have a Nice Dream =)", likeGiverIds: [2, 3] },
  { id: 3, authorId: 1, title: "I Love U", content: "Here's my second post!", likeGiverIds: [] },
];

//define Schema of GraphQL
const typeDefs = gql`
	enum HeightUnit{
		METRE
		CENTIMETRE
		FOOT	
	}
	enum WeightUnit{
		KILOGRAM
		GRAM
		POUND
	}
	type User{
		id:ID!
		name:String
		age:Int
		friends:[User]
		height(unit: HeightUnit = CENTIMETRE):Float
		weight(unit: WeightUnit = KILOGRAM):Float
		posts:[Post]	
	}
	type Post {
		id: ID!
		author: User
		title: String
		content: String
		likeGivers: [User]
	}

	type Query{
		"A simple type fof getting start!"
		hello:String
		me:User
		users:[User]
		user(name: String!):User
	}
	
	input AddPostInput{
		title:String!
		content:String!
	}

	type Mutation{ 
		addPost(input: AddPostInput!): Post 
		likePost(PostId: ID!):Post
	}

	
`;


//useful function prevent code redundancy

const findUserById = id => users.find(user => user.id === id);
const findUserByName = name => users.find(user => user.name === name);
const filterPostsByAuthorId = authorId =>posts.filter(post => post.authorId === authorId);

//mutation variable
const meId = 1;
const findPostById = id => posts.find(post => post.id === id);

//resolver is function map of field in Schema 
const resolvers = {
	Query:{
		hello:()=>'world',
		me:()=>users[0],
		users: ()=> users,
		user:(parent, args, context)=>{
			const {name} = args;
			return users.find (user => user.name === name);
		}
	},
	User:{
		name:(parent, args, context)=>{
			const date = new Date();
			if(date.getMonth()+1 === 12 && date.getDate() === 31 ){
			return parent.name + " Merry X'mas and Happy New Year!~";
			}else{
			return parent.name;
			}
		},
		friends:(parent, args, context)=>{
			const{friendIds } = parent;
			return users.filter(user => friendIds.includes(user.id));
		},
		height:(parent, args, context)=>{
			const {unit} = args;
			if(!unit || unit === "CENTIMETRE"){
				return parent.height;
			}else if( unit === "METRE"){
				return parent.height/100;
			}else if( unit === "FOOT"){
				return parent.height/30.48; 
			}
			throw new Error(`Height unit "${unit}" not supported` );
		},
		weight:(parent, args, context)=>{
			const{unit} = args;
			if(!unit || unit === "KILOGRAM"){
				return parent.weight;
			}else if (unit === "GRAM"){
				 return parent.weight * 100;
			}else if (unit == "POUND"){
				return parent.height/ 0.45359237;
			}
			throw new Error(`Weight unit "${unit}" not supported`);
		},
		posts: (parent, args, context) => {
			return filterPostsByAuthorId(parent.id);
		}
	},
	Post: {
		likeGivers: (parent, args, context) => {
		return parent.likeGiverIds.map(id => findUserById(id));
		},
		author: (parent, args, context) => {
		return findUserById(parent.authorId);
		}
	},

	Mutation:{
		addPost: (parent, args, context) =>{
			console.log("arguments are: ")
			console.log(args);
			const{title, content} = args.input;
			//first layer is input, second layer is title and content
			//check AddPostInput
			console.log(`Title: ${title} \nContent: ${content}\n`);
			//add new post
			const newPost = {
				id: posts.length + 1,
                                authorId: meId,
                                title,
                                content,
                                likeGivers:[]
	
			};
			posts.push(newPost);
			//return new added post
			return newPost;
		},
		likePost:(parent, args, context) =>{
			const{postId} = args;
			const post = findPostById(postId);
			if(!post) throw new Error(`Post ${postId} Not Exists`);

			if(post.likeGiverIds.include(meId)){
				const index = post.likeGiverIds.findIndex(id => id === meId);
				post.likeGiverIds.splice(index, 1);
			}else{
				post.likeGiverIds.push(meId);
			}
			return post;
		},
	},

	
};

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen(4000).then(({url}) => {
		console.log(`? Server ready at ${url}`);
	}
);
