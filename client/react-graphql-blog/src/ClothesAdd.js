import React from "react";
import gql from "graphql-tag";
import { Link, hashHistory } from "react-router";
import { Mutation } from "react-apollo";

const ADD_CLOTHES = gql`
  mutation AddClothes($name: String!) {
    addclothes(name: $name) {
      id
      name
      hashtags{
        id
      }
    }
  }
`;

const GET_ALL_CLOTHES = gql`
  query GetAllClothes {
    all_clothes {
      id
      name
    }
  }
`;


const ClothesAdd = () => {
  let nameInput;


  return (
    <Mutation mutation={ADD_CLOTHES} >
      {(addclothes, { data }) => (
        <div>
          <Link to="/">Back</Link>
          <form
            onSubmit={e => {
              e.preventDefault();
              addclothes({
                variables: { name: nameInput.value}
              }).then(() => hashHistory.push("/"));
 	             nameInput.value = "";
            }}
          >

            <label>Clothes name Title:</label>
            <input
              ref={node => {
                nameInput = node;
              }}
            />

            <button type="submit">Add Clothes</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};
export default ClothesAdd;
