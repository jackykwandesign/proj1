import React from "react";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router";

const GET_ALL_CLOTHES = gql`
  query GetAllClothes {
    all_clothes {
      id
      name
    }
  }
`;

const Posts = () => (
  <Query query={GET_ALL_CLOTHES}>
    {({ loading, error, data, refetch }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      const postList = data.all_clothes.map(({ id, name }) => {
        return (
          <li key={id} className="collection-item">
            < Link to= {`/clothes/${id}`}> {name} </Link>
          </li>
        );
      });

      return (
        <div>

          <ul className="collection">{postList}</ul>
	  <Link to="/clothes/new" className="btn-floating btn-large red right">
            <i className="material-icons">add</i>
          </Link>

        </div>
      );
    }}
  </Query>
);
export default Posts;
