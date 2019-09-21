import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import Customers from './components/Customers';
import Products from './components/Products';
import Stores from './components/Stores';
import Sales from './components/Sales';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/customers' component={Customers} />
        <Route path='/products' component={Products} />
        <Route path='/stores' component={Stores} />
        <Route path='/sales' component={Sales} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}
