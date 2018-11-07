import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout, sendMessage } from '../../actions'
import { Icon } from 'react-icons-kit'
import {signOut, info, fileImageO, fileO, send, bars} from 'react-icons-kit/fa'
import logo from '../../images/logoNav2.png'
import defaulAvatar from '../../images/default-avatar.png'
import {ClickOutside, SlickLightbox} from '../../components'
import {withFirestore} from 'react-redux-firebase'
import {compose} from 'redux'
import _ from 'lodash'
import {connectStringID, formatDate, transferToImage} from '../../services/utils.services'
import ReactTooltip from 'react-tooltip'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback)),
    sendMessage: (data, callback) => dispatch(sendMessage(data, callback))
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
    toggleSidebar: PropTypes.func,
    showSidebar: PropTypes.bool
  }

  constructor(props){
    super(props)
    const {dataChat} = this.props
    this.state = {
      showDropdown: false,
      messages: dataChat && dataChat.messages && !!dataChat.messages.length ? dataChat.messages : [],
      lastChat: dataChat && dataChat.lastChatAt ? dataChat.lastChatAt : null,
      content: "",
      originID: "",
      files: []
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
    if((this.state.content || this.state.files.length) && this.props.match.params && this.props.match.params.id){
      let sendmessage = this.state.content.replace(/(\r\n|\n)/g, '<br/>')
      this.props.sendMessage(
        {messages: this.state.messages, content: transferToImage(sendmessage), files: this.state.files, infoUser: this.props.infoUser},
        () => {this.scrollToBottom()}
      )
      this.setState({
        files: [],
        content: ''
      })
    }
  }

  handleKeyPress(event){
    if(event.key === 'Enter' && !event.altKey && this.props.match.params && this.props.match.params.id){
      event.preventDefault();
      event.target.value = ""
      this.handleOnSubmit()
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

  handleOnSelectFile(event){
    let files = event.target.files
    this.setState({
      files: [...this.state.files, ...files]
    })
  }

  handleRemoveImage(index){
    let tempFiles = this.state.files
    tempFiles = tempFiles.filter((item, key) => {
      return key !== index
    })
    this.setState({
      files: tempFiles
    })
  }

  handleContentChange(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleShowSidebar(){
    this.props.toggleSidebar && this.props.toggleSidebar()
  }

  render() {
    const {profile} = this.props
    const uid = profile.uid ? profile.uid : profile.UID
    const display_name = profile.display_name ? profile.display_name : profile.displayName
    return (
      <div className={styles.chatbox}>
        <div className={this.props.showSidebar ? "d-none" : "chat" }>
          <div className="chat-header clearfix">
            <div className="logo">
              <img src={logo} alt="logo" />
              <button type="button" className="btn btn-toggle d-sm-none d-block" onClick={this.handleShowSidebar.bind(this)}>
                <span><Icon icon={bars} size={22} style={{color: '#4EBDEB', position: 'relative', top: '-2px'}}/></span>
              </button>
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
                  if(!(item.content || (item.images && item.images.length))){
                    return null
                  }
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
                        {item.content ?
                          <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                          : null
                        }
                        {item.images && !!item.images.length && item.images.length > 1 &&
                          <SlickLightbox images={item.images} />
                        }
                        {item.images && item.images.length === 1 &&
                          <p>
                            <img src={item.images[0]} alt="message-img" style={{height: '200px', width: '200px'}}/>
                          </p>
                        }
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
                value={this.state.content} onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleContentChange.bind(this)}/>
              <span className="media">
                <span className="file">
                  <Icon icon={fileO} size={18} />
                </span>
                <label htmlFor="image-upload" className="fileImage">
                  <Icon icon={fileImageO} size={18} /> &nbsp;&nbsp;&nbsp;
                  <input id="image-upload" type="file" multiple accept="image/*" onChange={this.handleOnSelectFile.bind(this)} style={{display: "none"}}/>
                </label>
                <span className="d-sm-none d-block">
                  <button type="button" className="btn-send" onClick={this.handleOnSubmit.bind(this)}>
                    <Icon icon={send} size={24} style={{background: 'transparent !important', color: '#4EBDEB'}}/>
                  </button>
                </span>
                <div className="image-box">
                  <div className="preview-box">
                    {this.state.files && this.state.files.map((item, key) => {
                        return(
                          <div className="tag" key={key}>
                            <button type="button" className="close-x" onClick={this.handleRemoveImage.bind(this, key)}>
                              <span>X</span>
                            </button>
                            <p>{item.name}</p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <button type="button" className="btn-send d-sm-block d-none" onClick={this.handleOnSubmit.bind(this)}>
                  <Icon icon={send} size={24} style={{background: 'transparent !important', color: '#4EBDEB'}}/>
                </button>
              </span>
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
