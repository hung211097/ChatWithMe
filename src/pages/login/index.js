import React, { Component } from 'react';
import styles from './index.scss';
import Logo from '../../images/logoLarge.png'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {login} from '../../actions'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import { Link } from 'react-router-dom'

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
      password: '',
      isSubmit: false,
      isError: false,
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })
    if(!this.validate()){
      return
    }
    this.props.login({username: this.state.username, password: this.state.password})
  }

  validate(){
    if(this.state.username === '' || this.state.password === ''){
      return false
    }
    return true
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
      <div className={styles.loginPage}>
        <div className="well-logo">
          <div className="slogan">
            <img src={Logo} alt="logo" />
            <h1>Bring Us Together</h1>
          </div>
        </div>
        <div className="form-login">
          <h2>Sign In</h2>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="field">
              <div className="input-effect">
                <input className="effect-input" type="text" placeholder="Username" onChange={this.handleChangeUsername.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.username &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
            </div>
            <div className="field">
              <div className="input-effect">
                <input className="effect-input" type="password" placeholder="Password" onChange={this.handleChangePassword.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.password &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
            </div>
            <div className="loggin">
              <button className="btn btn-primary" type="submit" onClick={this.handleSubmit.bind(this)}>Sign in</button>
              <p>You don't have an account, <Link to='/register'>Sign up here</Link></p>
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
