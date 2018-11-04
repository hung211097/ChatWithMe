import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions'
import { Icon } from 'react-icons-kit'
import {signOut} from 'react-icons-kit/fa/signOut'
import {info} from 'react-icons-kit/fa/info'
import {fileImageO} from 'react-icons-kit/fa/fileImageO'
import {fileO} from 'react-icons-kit/fa/fileO'
import logo from '../../images/logoNav2.png'
import defaulAvatar from '../../images/default-avatar.png'
import ClickOutside from '../../components/click-outside'
import {withFirestore} from 'react-redux-firebase'
import {compose} from 'redux'
import _ from 'lodash'
import {connectStringID, formatDate} from '../../services/utils.services'
import ReactTooltip from 'react-tooltip'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback))
  }
}

const mapStateToProps = (state) => {
  // console.log("STATE", state);

  let chatData = _.values(state.firestore.data.chatbox)
  let tempProfile = state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  let uid = tempProfile.uid ? tempProfile.uid : tempProfile.UID
  if(state.chat.infoUser){
    let stringID = connectStringID(uid, state.chat.infoUser.uid)
    chatData = chatData.filter((item) => {
      return item.id === stringID
    })
    if(chatData.length){
      chatData = chatData[0]
    }
  }

  return{
    dataChat: chatData,
    infoUser: state.chat.infoUser,
    profile: tempProfile
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
      content: "",
      originID: ""
    }
  }

  componentDidMount(){
    const {dataChat} = this.props
    if(this.props.match.params && this.props.match.params.id){
      this.setState({
        messages: dataChat && dataChat.messages && !!dataChat.messages.length ? dataChat.messages : [],
        lastChat: dataChat && dataChat.lastChatAt ? dataChat.lastChatAt : null,
      }, () => {
        this.scrollToBottom()
      })
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    const {dataChat} = props
    this.setState({
      messages: dataChat && dataChat.messages && !!dataChat.messages.length ? dataChat.messages : [],
      lastChat: dataChat && dataChat.lastChatAt ? dataChat.lastChatAt : null,
    }, () => {
      this.scrollToBottom()
    })
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

  handleOnSubmit(){
    const{firestore} = this.props
    const{profile} = this.props
    let uid = profile.uid ? profile.uid : profile.UID
    if(this.state.content){
      let arr = this.state.messages
      let date = new Date()
      let connectString = connectStringID(uid, this.props.infoUser.uid)
      arr.push({
        belongTo: uid,
        chatAt: date.toString(),
        content: this.state.content
      })
      firestore.get({collection: 'chatbox', where: ['id', '==', connectString]}).then((data) => {
        if(data.docs.length){
          let id = data.docs[0].id
          firestore.update({collection: 'chatbox', doc: id}, {lastChatAt: date.toString(), messages: arr}).then(() => {
            this.scrollToBottom()
          })
        }
        else{
          firestore.collection('chatbox').doc(connectString).set({
            id: connectString,
            lastChatAt: date.toString(),
            messages: arr
          })
        }
      })
    }
  }

  handleKeyPress(event){
    if(event.key === 'Enter' && !event.altKey && this.props.match.params && this.props.match.params.id){
      event.preventDefault();
      let temp = event.target.value
      event.target.value = ""
      this.setState({
        content: temp
      }, () => {
        this.handleOnSubmit()
      })
    } else if (event.key === 'Enter' && !event.altKey && this.props.match && !this.props.match.params.id){
      event.preventDefault();
      event.target.value = ""
    }
    else if(event.key === 'Enter' && event.altKey){
      event.target.value += "\n"
    }
  }

  scrollToBottom(){
    let box = document.getElementById('box-chat')
    box.scrollTop = box.scrollHeight - box.clientHeight;
  }

  render() {
    // console.log(this.props);
    const {profile} = this.props
    const uid = profile.uid ? profile.uid : profile.UID
    const display_name = profile.display_name ? profile.display_name : profile.displayName
    return (
      <div className={styles.chatbox}>
        <div className="chat">
          <div className="chat-header clearfix">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="current-user" onClick={this.handleShowDropdown.bind(this)}>
              <h3>{display_name}</h3>
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
          <div className="chat-history" id="box-chat">
            <ul>
              {!!this.state.messages.length && this.state.messages.map((item, key) => {
                  return(
                    <li className={uid === item.belongTo ? "clearfix" : ""} key={key}>
                      <div className={uid === item.belongTo ? "message-data align-right" : "message-data"}>
                        {uid === item.belongTo ?
                          <div>
                            <span className="message-data-time" data-tip={formatDate(item.chatAt, "DD/MM/YYYY, hh:mm A")}>
                              {formatDate(item.chatAt, "hh:mm A, dddd")}
                            </span> &nbsp; &nbsp;
                            <ReactTooltip />
                            <span className="message-data-name">{uid === item.belongTo ? display_name : this.props.infoUser.name}</span> &nbsp;
                            <span className={uid === item.belongTo ? "circle me" : "circle other"}/>
                          </div>
                          :
                          <div>
                            <span className="message-data-name">
                              <span className={uid === item.belongTo ? "circle me" : "circle other"}/>
                              {uid === item.belongTo ? display_name : this.props.infoUser.name}
                            </span>
                            <span className="message-data-time" data-tip={formatDate(item.chatAt, "DD/MM/YYYY, hh:mm A")}>
                              {formatDate(item.chatAt, "hh:mm A, dddd")}
                            </span> &nbsp; &nbsp;
                            <ReactTooltip />
                          </div>
                        }
                      </div>
                      <div className={uid === item.belongTo ? "message my-message float-right" : "message other-message"}>
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
                defaultValue="" onKeyPress={this.handleKeyPress.bind(this)}/>
              <span className="file">
                <Icon icon={fileO} size={18} />
              </span>
              <span className="fileImage">
                <Icon icon={fileImageO} size={18} /> &nbsp;&nbsp;&nbsp;
              </span>
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
    connect(mapStateToProps, mapDispatchToProps)
  )(ChatBox)
);
