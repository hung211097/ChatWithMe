import React, { Component } from 'react';
import styles from './index.scss';
import Logo from '../../images/logoLarge.png'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { loginWithUsername, logout, loginWithGoogle } from '../../actions'
// import {firebaseConnect} from 'react-redux-firebase'
// import {compose} from 'redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { loadItem } from '../../services/localStorage.services'
import {googlePlus} from 'react-icons-kit/fa/googlePlus'
import { Icon } from 'react-icons-kit'
import { accountStatus } from '../../constants/localStorage'
import { Redirect } from 'react-router-dom'

const mapDispatchToProps = (dispatch) => {
  return{
    loginWithUsername: (user) => dispatch(loginWithUsername(user)),
    loginWithGoogle: () => dispatch(loginWithGoogle()),
    logout: () => dispatch(logout())
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return{
    auth_status: state.auth.auth_status,
    notLogged: state.firebase.auth.isEmpty
  }
}

class Login extends Component {
  static propTypes = {
    auth_status: PropTypes.string,
    notLogged: PropTypes.bool,
    loginWithUsername: PropTypes.func,
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

  componentDidMount(){
    if(loadItem('account_status') === accountStatus.LOGGED){
      this.props.history.push('/')
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
    this.props.loginWithUsername({username: this.state.username, password: this.state.password})
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

  handleGoogleLogin(){
    this.props.loginWithGoogle()
  }

  render() {
    if(loadItem('account_status') === accountStatus.LOGGED){
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
          <h2>Đăng nhập</h2>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="field">
              <div className="input-effect">
                <input className="effect-input" name="username" type="text" placeholder="Tài khoản" onChange={this.handleChangeUsername.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.username &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
            </div>
            <div className="field">
              <div className="input-effect">
                <input className="effect-input" type="password" placeholder="Mật khẩu" onChange={this.handleChangePassword.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.password &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
            </div>
            <div className="loggin">
              <button className="btn btn-primary" type="submit" onClick={this.handleSubmit.bind(this)}>Đăng nhập</button>
              <button className="btn btn-google" type="button" onClick={this.handleGoogleLogin.bind(this)}><Icon icon={googlePlus} size={24} style={{position: 'relative', top: '-2px'}}/>
              &nbsp;Đăng nhập với Google</button>
              <p>Bạn chưa có tài khoản, <Link to='/register'>Đăng ký ở đây</Link></p>
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
