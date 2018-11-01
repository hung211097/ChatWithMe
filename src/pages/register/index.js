import React, { Component } from 'react';
import styles from'./index.scss';
import Logo from '../../images/logoLarge.png'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { register, changStatus } from '../../actions'
// import { withFirestore} from 'react-redux-firebase'
// import {compose} from 'redux'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../services/utils.services'
import PropTypes from 'prop-types'
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadItem } from '../../services/localStorage.services'
import { accountStatus } from '../../constants/localStorage'

const mapDispatchToProps = (dispatch) => {
  return{
    register: (user, callback) => dispatch(register(user, callback)),
    changeStatus: (status) => dispatch(changStatus(status))
  }
}

const mapStateToProps = (state) => {
  return{
    auth_status: state.auth.auth_status,
    notLogged: state.firebase.auth.isEmpty
  }
}

class Register extends Component {
  static propTypes = {
    auth_status: PropTypes.string,
    notLogged: PropTypes.bool,
    register: PropTypes.func,
    changeStatus: PropTypes.func
  }

  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      confirmPass: '',
      email: '',
      isSubmit: false,
      isShow: false,
      timeout: 0
    }
  }

  componentDidMount(){
    document.body.style.overflow = 'auto'
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
    this.props.register({username: this.state.username, password: this.state.password, email: this.state.email}, () => {this.showAlert()})
  }

  showAlert(){
    this.setState({
      isShow: true,
      // timeout: 5000
    })
    this.timeOut = setTimeout(() => {
      this.hideAlert()
    }, 5000)
  }

  componentWillUnmount(){
    this.timeOut && clearTimeout(this.timeOut)
  }

  validate(){
    if(this.state.username === '' || this.state.password === '' || this.state.confirmPass === '' || this.state.email === ''
      || this.state.password.length < 6){
      return false
    }
    if(!validateEmail(this.state.email)){
      return false
    }

    if(this.state.password !== this.state.confirmPass){
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

  handleChangeConfirmPassword(e){
    this.setState({
      confirmPass: e.target.value
    })
    if(this.props.auth_status !== null){
      this.props.changeStatus(null)
    }
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
    if(this.props.auth_status !== null){
      this.props.changeStatus(null)
    }
  }

  hideAlert(){
    this.setState({
      isShow: false
    })
    this.props.history.push('/')
  }

  render() {
    return (
      <div className={styles.registerPage}>
        <div className="well-logo">
          <div className="slogan">
            <img src={Logo} alt="logo" />
            <h1>Bring Us Together</h1>
          </div>
        </div>
        <div className="form-login">
          <h2>Đăng ký</h2>
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
                <input className="effect-input" name="email" type="text" placeholder="Email" onChange={this.handleChangeEmail.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.email &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
              {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                <p className="error">Hãy điền đúng định dạng email!</p>
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
              {this.state.isSubmit && this.state.password && this.state.password.length < 6 &&
                <p className="error">Mật khẩu phải có ít nhất 6 ký tự!</p>
              }
            </div>
            <div className="field">
              <div className="input-effect">
                <input className="effect-input" type="password" placeholder="Xác nhận mật khẩu" onChange={this.handleChangeConfirmPassword.bind(this)}/>
                <span className="focus-border"></span>
              </div>
              {this.state.isSubmit && !this.state.confirmPass &&
                <p className="error">Hãy điền thông tin vào đây!</p>
              }
              {this.state.isSubmit && this.state.password !== this.state.confirmPass && this.state.confirmPass &&
                <p className="error">Mật khẩu xác nhận chưa khớp!</p>
              }
            </div>
            <div className="loggin">
              <button className="btn btn-primary" type="submit" onClick={this.handleSubmit.bind(this)}>Sign up</button>
              <p>Bạn đã có tài khoản, <Link to='/login'>Đăng nhập ở đây</Link></p>
              {this.state.isSubmit && this.props.auth_status === 'failed' &&
                <p className="error">Tên tài khoản hoặc email đã tồn tại!</p>
              }
            </div>
          </form>
        </div>
        <SweetAlert
        	success
        	confirmBtnText="OK"
        	confirmBtnBsStyle="primary"
        	title="Đăng ký thành công!"
          show={this.state.isShow}
        	onConfirm={this.hideAlert.bind(this)}
        	onCancel={this.hideAlert.bind(this)}
        >
        	Bạn sẽ được chuyển về trang chủ sau 5s hoặc ngay sau khi đóng thông báo!
        </SweetAlert>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
