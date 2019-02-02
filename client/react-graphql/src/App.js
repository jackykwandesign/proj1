import { ApolloProvider } from "react-apollo";
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Clothes from "./Clothes";
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://vmkwan.pod.hk:3100/'
});












function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Clothes />
      </div>
    </ApolloProvider>
  );
}

export default App;

