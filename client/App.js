import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://z5r11749r7.lp.gql.zone/graphql'
});
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <h2>My first Apollo app ?</h2>
        </div>
      </ApolloProvider>
    );
  }
}

