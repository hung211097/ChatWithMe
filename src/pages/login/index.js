import React, { Component } from 'react';
import styles from './index.scss';
import Logo from '../../images/logoLarge.png'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { login, changStatus, logout } from '../../actions'
import { Redirect } from 'react-router-dom'
// import {firebaseConnect} from 'react-redux-firebase'
// import {compose} from 'redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const mapDispatchToProps = (dispatch) => {
  return{
    login: (user) => dispatch(login(user)),
    changeStatus: (status) => dispatch(changStatus(status)),
    logout: () => dispatch(logout())
  }
}

const mapStateToProps = (state) => {
  return{
    auth_status: state.auth.auth_status,
    notLogged: state.firebase.auth.isEmpty
  }
}

class Login extends Component {
  static propTypes = {
    auth_status: PropTypes.string,
    notLogged: PropTypes.bool,
    login: PropTypes.func,
    changeStatus: PropTypes.func
  }

  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      isSubmit: false
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
    if(this.props.auth_status !== null){
      this.props.changeStatus(null)
    }
  }

  handleChangePassword(e){
    this.setState({
      password: e.target.value
    })
    if(this.props.auth_status !== null){
      this.props.changeStatus(null)
    }
  }

  render() {
    if(this.props.auth_status === 'success' || !this.props.notLogged){
      return <Redirect to='/' />
    }
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
                <input className="effect-input" name="username" type="text" placeholder="Username" onChange={this.handleChangeUsername.bind(this)}/>
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
              {this.state.isSubmit && this.props.auth_status === 'failed' &&
                <p className="error">Sai tài khoản hoặc mật khẩu</p>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
