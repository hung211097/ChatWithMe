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
import {withFirestore, withFirebase, firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import _ from 'lodash'
import {connectStringID, formatDate} from '../../services/utils.services'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback))
  }
}

const mapStateToProps = (state) => {
  console.log("STATE", state);

  let chatData = _.values(state.firestore.data.chatbox)
  if(chatData.length){
    chatData = chatData[0]
  }

  console.log("CHAT",chatData)
  return{
    dataChat: chatData,
    nameUserChat: state.chat.nameUser,
    profile: state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  }
}

class ChatBox extends Component {
  static propTypes = {
    profile: PropTypes.object,
  }

  constructor(props){
    super(props)
    const {dataChat} = this.props
    this.state = {
      showDropdown: false,
      messages: dataChat && dataChat.messages && !!dataChat.messages.length ? dataChat.messages : [],
      lastChat: dataChat && dataChat.lastChatAt ? dataChat.lastChatAt : null,
      content: ""
    }
  }

  componentDidMount(){
    const {firestore} = this.props
    const {profile} = this.props

    if(this.props.match.params && this.props.match.params.id){
      firestore.setListener({collection: 'chatbox', where: ['id', '==', connectStringID(profile.uid, this.props.match.params.id)]})

      // firestore.get({collection: 'chatbox', where: ['id', '==', connectStringID(profile.uid, this.props.match.params.id)]}).then((data) => {
      //   if(data.docs.length){
      //     let temp =  data.docs[0].data()
      //     this.setState({
      //       messages: temp.messages,
      //       lastChat: temp.lastChatAt
      //     })
      //   }
      // })
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    const {dataChat} = props
    this.setState({
      messages: dataChat && dataChat.messages && !!dataChat.messages.length ? dataChat.messages : [],
      lastChat: dataChat && dataChat.lastChatAt ? dataChat.lastChatAt : null,
    })
  }

  componentWillUnmount(){
    const {firestore} = this.props
    const {profile} = this.props
    firestore.unsetListener({collection: 'chatbox', where: ['id', '==', connectStringID(profile.uid, this.props.match.params.id)]})
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

  handleChangeContent(e){
    this.setState({
      content: e.target.value
    })
  }

  handleOnSubmit(){
    if(this.state.content){

    }
  }

  render() {
    console.log(this.props);
    console.log("COMPONENT", this.state);
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
              {!!this.state.messages.length && this.state.messages.map((item, key) => {
                  return(
                    <li className={profile.uid === item.belongTo ? "clearfix" : ""} key={key}>
                      <div className={profile.uid === item.belongTo ? "message-data align-right" : "message-data"}>
                        {profile.uid === item.belongTo ?
                          <div>
                            <span className="message-data-time">{formatDate(item.chatAt, "hh:mm A, dddd")}</span> &nbsp; &nbsp;
                            <span className="message-data-name">{profile.uid === item.belongTo ? profile.display_name : this.props.nameUserChat}</span>
                            <span className={profile.uid === item.belongTo ? "circle me" : "circle other"}/>
                          </div>
                          :
                          <div>
                            <span className="message-data-name">
                              <span className={profile.uid === item.belongTo ? "circle me" : "circle other"}/>
                              {profile.uid === item.belongTo ? profile.display_name : this.props.nameUserChat}
                            </span>
                            <span className="message-data-time">{formatDate(item.chatAt, "hh:mm A, dddd")}</span> &nbsp; &nbsp;
                          </div>
                        }
                      </div>
                      <div className={profile.uid === item.belongTo ? "message my-message float-right" : "message other-message"}>
                        {item.content}
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          {/* end chat-history */}
          <div className="chat-message clearfix">
            <form onSubmit={this.handleOnSubmit.bind(this)}>
              <textarea name="message-to-send" id="message-to-send" placeholder="Nhập tin nhắn" rows={3}
                defaultValue={this.state.content} onChange={this.handleChangeContent.bind(this)}/>
              <a className="file">
                <Icon icon={fileO} size={18} />
              </a>
              <a className="fileImage">
                <Icon icon={fileImageO} size={18} /> &nbsp;&nbsp;&nbsp;
              </a>
              <button type="button" onClick={this.handleOnSubmit.bind(this)}>Gửi</button>
            </form>
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
    withFirebase,
    firestoreConnect(['users']),
    connect(mapStateToProps, mapDispatchToProps)
  )(ChatBox)
);
