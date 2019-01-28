import React, { Component } from 'react';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import PostClothes from "./PostClothes";
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ClothesPage from "./ClothesPage";
import ClothesAdd from "./ClothesAdd";

const client = new ApolloClient({
  uri: 'http://vmkwan.pod.hk:3000/',
});


const App = ({ children }) => {
  return (
    <div className="container">
      <h2>My Blog ?</h2>
      {children}
    </div>
  );
};

class Root extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={PostClothes} />
		<Route path="clothes/new" component={ClothesAdd} />
		<Route path="clothes/:id" component={ClothesPage} />
          </Route>
        </Router>
      </ApolloProvider>
    );
  }
}

export default Root;
