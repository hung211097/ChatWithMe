import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { logout } from '../../actions'
import { saveItem, loadItem } from '../../services/localStorage.services'
import { accountStatus } from '../../constants/localStorage'
import { Icon } from 'react-icons-kit'
import {search} from 'react-icons-kit/fa/search'
import {starO} from 'react-icons-kit/fa/starO'
import {star} from 'react-icons-kit/fa/star'
import {signOut} from 'react-icons-kit/fa/signOut'
import {info} from 'react-icons-kit/fa/info'
import {fileImageO} from 'react-icons-kit/fa/fileImageO'
import {fileO} from 'react-icons-kit/fa/fileO'
import logo from '../../images/logoNav2.png'
import defaulAvatar from '../../images/default-avatar.png'
import ClickOutside from '../../components/click-outside'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback))
  }
}

const mapStateToProps = (state) => {
  return{
    notLogged: state.firebase.auth.isEmpty,
    profile: state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  }
}

class Register extends Component {
  static propTypes = {
    profile: PropTypes.object,
    notLogged: PropTypes.bool,
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
    return (
      <div className={styles.homePage}>
        {/*<button className="btn btn-primary" onClick={this.handleLogout.bind(this)}>Đăng xuất</button>*/}
        <div className="container-app clearfix">
          <div className="people-list" id="people-list">
            <div className="search">
              <input type="text" placeholder="search" />
              <Icon icon={search} size={16} style={{color: 'white', position: 'relative', top: '-2px'}} className="fa-search"/>
            </div>
            <ul className="list">
              <li className="clearfix active">
                <img src={defaulAvatar} alt="avatar" />
                <div className="about">
                  <div className="name">Vincent Porter</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Aiden Chavez</div>
                  <div className="status">
                    <span className="circle offline"/> left 7 mins ago
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Mike Thomas</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Erica Hughes</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_05.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Ginger Johnston</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_06.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Tracy Carpenter</div>
                  <div className="status">
                    <span className="circle offline"/> left 30 mins ago
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_07.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Christian Kelly</div>
                  <div className="status">
                    <span className="circle offline"/> left 10 hours ago
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_08.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Monica Ward</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_09.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Dean Henry</div>
                  <div className="status">
                    <span className="circle offline"/> offline since Oct 28
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
              <li className="clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg" alt="avatar" />
                <div className="about">
                  <div className="name">Peyton Mckinney</div>
                  <div className="status">
                    <span className="circle online"/> online
                  </div>
                </div>
                <a className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></a>
              </li>
            </ul>
          </div>
          <div className="chat">
            <div className="chat-header clearfix">
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <div className="current-user" onClick={this.handleShowDropdown.bind(this)}>
                <h3>Olia</h3>
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
              {/*<div className="chat-about">
                <div className="chat-with">Chat with Vincent Porter</div>
                <div className="chat-num-messages">already 1 902 messages</div>
              </div>
              <i className="fa fa-star" />*/}
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
          {/* end chat */}
        </div>
        {/* end container */}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
