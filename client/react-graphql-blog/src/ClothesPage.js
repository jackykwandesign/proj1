import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router";

const GET_CLOTHES_DETAIL = gql`
  query ClothesDetail($clothesId: ID!) {
    clothes(id: $clothesId) {
      id
      name
      hashtags {
        id
	name
      }
    }
  }
`;



class ClothesPage extends Component {
  render() {
    return (
      <Query
        query={GET_CLOTHES_DETAIL}
        variables={{ clothesId: this.props.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div>
              <h3>{data.clothes.name}</h3>
              <Link to="/">Back</Link>
            </div>
          );
        }}
      </Query>
    );
  }
}





export default ClothesPage;
