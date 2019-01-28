const {ApolloServer,gql} = require('apollo-server');
//activate server class, provide web aplication by express bg
//gql let use use graphQL in Javascript

//fake data
const meId = 1;
const users = [
  {
    id: 1,
    email: 'fong@test.com',
    password: '$2b$04$wcwaquqi5ea1Ho0aKwkZ0e51/RUkg6SGxaumo8fxzILDmcrv4OBIO', // 123456
    name: 'Fong',
    age: 23,
    friendIds: [2, 3]
  },
  {
    id: 2,
    email: 'kevin@test.com',
    passwrod: '$2b$04$uy73IdY9HVZrIENuLwZ3k./0azDvlChLyY1ht/73N4YfEZntgChbe', // 123456
    name: 'Kevin',
    age: 40,
    friendIds: [1]
  },
  {
    id: 3,
    email: 'mary@test.com',
    password: '$2b$04$UmERaT7uP4hRqmlheiRHbOwGEhskNw05GHYucU73JRf8LgWaqWpTy', // 123456
    name: 'Mary',
    age: 18,
    friendIds: [1]
  }
];

const posts = [
  {
    id: 1,
    authorId: 1,
    title: 'Hello World',
    body: 'This is my first post',
    likeGiverIds: [1, 2],
    createdAt: '2018-10-22T01:40:14.941Z'
  },
  {
    id: 2,
    authorId: 2,
    title: 'Nice Day',
    body: 'Hello My Friend!',
    likeGiverIds: [1],
    createdAt: '2018-10-24T01:40:14.941Z'
  }
];


//define Schema of GraphQL
const typeDefs = gql`
	type User{
		id:ID!
		email:String!
		name:String
		age:Int
		friends:[User]
		posts:[Post]	
	}
	type Post{
		id:ID!
		author: User
		title: String
		likeGivers:[User]
		createAt: String
	}
	type Query{
		hello:String
		me: User
		users:[User]
		user(name:String!):User
		posts:[Post]
		post(id:ID!):Post
	}

	
`;


//useful function prevent code redundancy

const findUserByUserId = id => users.find(user => user.id === Number(id));
const filterPostsByUserId = userId =>posts.filter(post => userId === post.authorId);
const filterUsersByUserIds = userIds => users.filter(user => userIds.includes(user.id));
const findUserByName = name => users.find(user => user.name === name);
const findPostByPostId = postId => posts.find(post => post.id === Number(postId));

//resolver is function map of field in Schema 
const resolvers = {
	Query:{
		hello:() => 'world',
		me: () => findUserByUserId(meId),
		users: () => users,
		user: (parent, {name}, context) => findUserByName(name),
		posts: () => posts,
		post: (parent, {id}, context) => findPostByPostId(id),
	},
	User:{
		friends:(parent, args, context)=> filterUsersByUserIds(parent.friendIds || []),
		posts: (parent, args, context) => filterPostsByUserId(parent.id)
	},
	Post: {
		likeGivers: (parent, args, context) => filterUserByUserIds(parent.likeGiverIds || []),
		author: (parent, args, context) => findUserByUserId(parent.authorId)
	},

	
};

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen(3000).then(({url}) => {
		console.log(`? Server ready at ${url}`);
	}
);

var http = require('http'),
    fs = require('fs');


fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(4000);
});
