import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Redirect from='/home' to='/' />
            <Route exact path='/' component={Home} />
            <Route exact path='/chatwith/:id' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
