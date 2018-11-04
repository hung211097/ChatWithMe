import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import {search} from 'react-icons-kit/fa/search'
import {withFirestore} from 'react-redux-firebase'
import {compose} from 'redux'
import User from '../user'
import _ from 'lodash'
import {compareDateReverse} from '../../services/utils.services'

const mapDispatchToProps = (dispatch) => {
  return{

  }
}

const mapStateToProps = (state) => {
  let temp = []
  let recentChat = []
  let tempRecentChat = []
  let tempProfile = state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  let uid = tempProfile.uid ? tempProfile.uid : tempProfile.UID
  let chatData = _.values(state.firestore.data.chatbox)

  if(state.firestore.data.users){
    temp = _.values(state.firestore.data.users)
    let myInfo = temp.find((item) => {  //Get my info
      return uid === item.UID
    })
    // console.log(myInfo);
    let stars = []
    if(myInfo && myInfo.stars && myInfo.stars.length){  //Get my star users
      stars = myInfo.stars
    }

    temp = temp.filter((item) => {  //Get List user not me
      return item.UID !== uid
    })

    if(chatData.length){
      chatData.sort((a, b) => { //Sort date last chat
        return compareDateReverse(a.lastChatAt, b.lastChatAt)
      })

      chatData.forEach((chat) => {
        if(chat){
          if(chat.id.indexOf(uid) >= 0){  //I used to chat with...
            let res = temp.find((item) => {
              if(chat.id.indexOf(item.UID) >= 0){
                return item
              }
              return null
            })
            if(res){  //Have someone
              if(stars.length){  //If I check star that user
                let tmp = stars.find((starUser) => {
                  return starUser.UID === res.UID
                })
                if(tmp && tmp.isStar && res.status === 'online'){  //Priority push if check star
                  recentChat.push(res)
                }else{
                  tempRecentChat.push(res)
                }
              }
              else{
                recentChat.push(res)
              }
            }
          }
        }
      })

      recentChat.forEach((item) => {
        temp = temp.filter((user) => {
          return user.UID !== item.UID
        })
      })

      temp.forEach((item) => {
        let res = stars.find((userStar) => {
          return item.UID === userStar.UID && userStar.isStar && item.status === 'online'
        })
        if(res){
          recentChat.push(item)
        }
      })

      recentChat = [...recentChat, ...tempRecentChat]
      recentChat.forEach((item) => {
        temp = temp.filter((user) => {
          return user.UID !== item.UID
        })
      })
    }
  }
  return{
    listUsers: [...recentChat, ...temp]
  }
}

class ListUsers extends Component {
  static propTypes = {
    listUsers: PropTypes.array
  }

  constructor(props){
    super(props)
    this.state = {
      name: ''
    }
  }

  handleChange(e){
    this.setState({
      name: e.target.value
    })
  }

  handleReset(){
    this.setState({
      name: ''
    })
  }

  render() {
    let {listUsers} = this.props
    let filteredListUsers = []
    if(this.state.name){
      listUsers.forEach((item) => {
        if(item.display_name.search(this.state.name) >= 0){
          filteredListUsers.push(item)
        }
      })
    }
    else{
      filteredListUsers = listUsers
    }
    return (
      <div className={styles.userListComponent}>
        <div className="people-list" id="people-list">
          <div className="search">
            <input type="text" placeholder="search" onChange={this.handleChange.bind(this)} value={this.state.name}/>
            <Icon icon={search} size={16} style={{color: 'white', position: 'relative', top: '-2px'}} className="fa-search"/>
            <button className="btn btn-reset" onClick={this.handleReset.bind(this)}>RESET</button>
          </div>
          <ul className="list">
            {!!filteredListUsers.length && filteredListUsers.map((item, key) => {
              return(
                  <User user={item} key={key}/>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(
  compose(
    withFirestore,
    connect(mapStateToProps, mapDispatchToProps)
  )(ListUsers)
);
