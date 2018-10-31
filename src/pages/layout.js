import React, { Component } from 'react';
import './index.css';
import PropTypes from 'prop-types'
import {Header, Footer} from './components/index'

class Layout extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default Layout;
