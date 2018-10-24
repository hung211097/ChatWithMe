import React, { Component } from 'react';
import './index.scss';
import Logo from '../../images/logoLarge.png'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {login} from '../../actions'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

const mapDispatchToProps = (dispatch) => {
  return{
    login: (user) => dispatch(login(user))
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return{}
}

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.login({username: this.state.username, password: this.state.password})
  }

  handleChangeUsername(e){
    this.setState({
      username: e.target.value
    })
  }

  handleChangePassword(e){
    this.setState({
      password: e.target.value
    })
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
        <div className="form-login">
          <h2>Sign In</h2>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="input-effect">
              <input className="effect-input" type="text" placeholder="Username" onChange={this.handleChangeUsername.bind(this)}/>
              <span className="focus-border"></span>
            </div>
            <div className="input-effect">
              <input className="effect-input" type="password" placeholder="Password" onChange={this.handleChangePassword.bind(this)}/>
              <span className="focus-border"></span>
            </div>
            <div className="loggin">
              <button className="btn btn-primary" type="submit" onClick={this.handleSubmit.bind(this)}>Sign in</button>
              <p>You don't have an account, <a href="index.html">Sign up here</a></p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(
  compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      {collection: 'users'}
    ])
  )(Login)
);
