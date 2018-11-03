import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import {search} from 'react-icons-kit/fa/search'
import {withFirestore, firestoreConnect, } from 'react-redux-firebase'
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
  let tempProfile = state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  let uid = tempProfile.uid ? tempProfile.uid : tempProfile.UID
  let chatData = _.values(state.firestore.data.chatbox)

  if(state.firestore.data.users){
    temp = _.values(state.firestore.data.users)
    temp = temp.filter((item) => {
      return item.UID !== uid
    })

    if(chatData.length){
      chatData.sort((a, b) => {
        return compareDateReverse(a.lastChatAt, b.lastChatAt)
      })

      chatData.forEach((chat) => {
        if(chat.id.indexOf(uid) >= 0){
          let res = temp.find((item) => {
            if(chat.id.indexOf(item.UID) >= 0){
              return item
            }
            return null
          })
          if(res){
            recentChat.push(res)
          }
        }
      })

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

    }
  }

  componentDidMount(){

  }

  render() {
    // console.log("PROPS", this.props);
    return (
      <div className={styles.userListComponent}>
        <div className="people-list" id="people-list">
          <div className="search">
            <input type="text" placeholder="search" />
            <Icon icon={search} size={16} style={{color: 'white', position: 'relative', top: '-2px'}} className="fa-search"/>
          </div>
          <ul className="list">
            {!!this.props.listUsers.length && this.props.listUsers.map((item) => {
              return(
                  <User user={item} key={item.UID}/>
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
    firestoreConnect(['users']),
    connect(mapStateToProps, mapDispatchToProps)
  )(ListUsers)
);
