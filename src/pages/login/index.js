import React, { Component } from 'react';
import './index.scss';
import Logo from '../../images/logoLarge.png'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div className="well-logo">
          <div className="slogan">
            <img src={Logo} alt="logo" />
            <h1>Bring Us Together</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
