import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const getUsersQuery = gql`
  {
    users {
      id
      name
      email
      age
    }
  }
`;

const Users = () => (
  <Query query={getUsersQuery}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      const lists = data.users.map(currentUser => (
        <li key={currentUser.id}>
          <li>id: {currentUser.id}</li>
          <li>name: {currentUser.name} </li>
          <li>email: {currentUser.email}</li>
          <li>age: {currentUser.age}</li>
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
export default Users;
