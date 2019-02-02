import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const getAll_clothesQuery = gql`
  {
	all_clothes{
		id
		name
  	}
  }
`;
let c_lists;
function getAllc(){
	return c_lists;
}
const Clothes = () => (
  <Query query={getAll_clothesQuery}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
	c_lists =  data.all_clothes;
      const lists = data.all_clothes.map(currentClothes => (
        <li key={currentClothes.id}>
          <li>id: {currentClothes.id}</li>
          <li>name: {currentClothes.name} </li>
          <br />
        </li>
      ));

      return (
        <div>
          <ul style={{ "list-style-type": "none" }}>{lists}</ul>
        </div>
      );
    }}
  </Query>
);
export default Clothes;

