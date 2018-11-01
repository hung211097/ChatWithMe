import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions'
import { saveItem, loadItem } from '../../services/localStorage.services'
import { accountStatus } from '../../constants/localStorage'
import { Icon } from 'react-icons-kit'
import {signOut} from 'react-icons-kit/fa/signOut'
import {info} from 'react-icons-kit/fa/info'
import {fileImageO} from 'react-icons-kit/fa/fileImageO'
import {fileO} from 'react-icons-kit/fa/fileO'
import logo from '../../images/logoNav2.png'
import defaulAvatar from '../../images/default-avatar.png'
import ClickOutside from '../../components/click-outside'
import {withFirestore, firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback))
  }
}

const mapStateToProps = (state) => {
  return{
    profile: state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  }
}

class ChatBox extends Component {
  static propTypes = {
    profile: PropTypes.object,
  }

  constructor(props){
    super(props)
    this.state = {
      showDropdown: false
    }
  }

  componentDidMount(){
    if(this.props.notLogged && loadItem('account_status') === accountStatus.UNLOGGED){
      this.props.history.push('/login')
    }
    else{
      saveItem('account_status', accountStatus.LOGGED)
    }
  }

  handleLogout(){
    this.props.logout(() => {
      this.props.history.push('/login')
    })
  }

  handleShowDropdown(){
    this.setState({
      showDropdown: true
    })
  }

  handleCloseDropdown(){
    this.setState({
      showDropdown: false
    })
  }

  render() {
    console.log(this.props);
    const {profile} = this.props
    return (
      <div className={styles.chatbox}>
        <div className="chat">
          <div className="chat-header clearfix">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="current-user" onClick={this.handleShowDropdown.bind(this)}>
              <h3>{profile && profile.display_name ? profile.display_name : profile.displayName}</h3>
              <img src={this.props.profile && this.props.profile.photoURL ? this.props.profile.photoURL : defaulAvatar} alt="avatar" />
              <ClickOutside onClickOutside={this.handleCloseDropdown.bind(this)}>
                <div className={this.state.showDropdown ? "dropdown-user show" : "dropdown-user"}>
                  <ul>
                    <li>
                      <span>Thông Tin</span>
                      <Icon icon={info} size={20} className="icon"/>
                    </li>
                    <li onClick={this.handleLogout.bind(this)}>
                      <span>Đăng Xuất</span>
                      <Icon icon={signOut} size={20} className="icon"/>
                    </li>
                  </ul>
                </div>
              </ClickOutside>
            </div>
          </div>
          {/* end chat-header */}
          <div className="chat-history">
            <ul>
              <li className="clearfix">
                <div className="message-data align-right">
                  <span className="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;
                  <span className="message-data-name">Olia</span> <span className="circle me"/>
                </div>
                <div className="message other-message float-right">
                  Hi Vincent, how are you? How is the project coming along?
                </div>
              </li>
              <li>
                <div className="message-data">
                  <span className="message-data-name"><span className="circle other"/> Vincent</span>
                  <span className="message-data-time">10:12 AM, Today</span>
                </div>
                <div className="message my-message">
                  Are we meeting today? Project has been already finished and I have results to show you.
                </div>
              </li>
              <li className="clearfix">
                <div className="message-data align-right">
                  <span className="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;
                  <span className="message-data-name">Olia</span> <span className="circle me"/>
                </div>
                <div className="message other-message float-right">
                  Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?
                </div>
              </li>
              <li>
                <div className="message-data">
                  <span className="message-data-name"><span className="circle other"/> Vincent</span>
                  <span className="message-data-time">10:20 AM, Today</span>
                </div>
                <div className="message my-message">
                  Actually everything was fine. I&quot;m very excited to show this to our team.
                </div>
              </li>
              <li>
                <div className="message-data">
                  <span className="message-data-name"><span className="circle other"/> Vincent</span>
                  <span className="message-data-time">10:31 AM, Today</span>
                </div>
                <span className="circle other"/>
                <span className="circle other" style={{background: '#444753e6'}}/>
                <span className="circle other" style={{background: '#444753cc'}}/>
              </li>
            </ul>
          </div>
          {/* end chat-history */}
          <div className="chat-message clearfix">
            <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows={3} defaultValue={""} />
            <a className="file">
              <Icon icon={fileO} size={18} />
            </a>
            <a className="fileImage">
              <Icon icon={fileImageO} size={18} /> &nbsp;&nbsp;&nbsp;
            </a>
            <button>Send</button>
          </div>
          {/* end chat-message */}
        </div>
      </div>
    );
  }
}

export default withRouter(
  compose(
    withFirestore,
    firestoreConnect(['users']),
    connect(mapStateToProps, mapDispatchToProps)
  )(ChatBox)
);
