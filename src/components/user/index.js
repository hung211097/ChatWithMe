import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import {starO} from 'react-icons-kit/fa/starO'
import {ic_star} from 'react-icons-kit/md/ic_star'
import defaulAvatar from '../../images/default-avatar.png'
import {fromNowTimeStamp} from '../../services/utils.services'
import {updateUserChatInfo} from '../../actions'
import {withFirestore} from 'react-redux-firebase'
import {compose} from 'redux'
import _ from 'lodash'

const mapDispatchToProps = (dispatch) => {
  return{
    updateUserChatInfo: (data) => dispatch(updateUserChatInfo(data))
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  let tempProfile = state.firebase.profile && state.firebase.profile.isEmpty ? state.firebase.auth : state.firebase.profile
  let uid = tempProfile.uid ? tempProfile.uid : tempProfile.UID
  let stars = []
  if(state.firestore.data.users){
    let temp = _.values(state.firestore.data.users)
    let myInfo = temp.find((item) => {
      return uid === item.UID
    })
    if(myInfo){
      stars = myInfo.stars
    }
  }
  return{
    myUID: uid,
    stars: stars
  }
}

class User extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  constructor(props){
    super(props)
    this.state = {
      active: false
    }
  }

  componentDidMount(){
    if(this.props.match && this.props.match.params.id === this.props.user.UID){
      this.setState({
        active: true
      })
      this.props.updateUserChatInfo({name: this.props.user.display_name, uid: this.props.user.UID})
    }
    else{
      this.setState({
        active: false
      })
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    if(props.match && props.match.params.id === props.user.UID){
      this.setState({
        active: true
      })
      this.props.updateUserChatInfo({name: props.user.display_name, uid: props.user.UID})
    }
    else{
      this.setState({
        active: false
      })
    }
  }

  handleStar(){
    const {firestore} = this.props
    const {user} = this.props
    firestore.get({collection: 'users', where: ['UID', '==', this.props.myUID]}).then((data) => {
      if(data.docs.length){
        let myInfo = data.docs[0].data()
        if(myInfo.stars){
          let temp = myInfo.stars
          let isUpdate = false
          for(let i = 0; i < temp.length; i++){
            if(user.UID === temp[i].UID){
              temp[i].isStar = !temp[i].isStar
              isUpdate = true
              break;
            }
          }

          if(!isUpdate){
            temp.push({
              UID: user.UID,
              isStar: true
            })
          }

          let idDoc = data.docs[0].id
          firestore.update({collection: 'users', doc: idDoc}, {stars: temp})
        }
        else{
          let idDoc = data.docs[0].id
          firestore.update({collection: 'users', doc: idDoc}, {stars: [{UID: user.UID, isStar: true}]})
        }
      }
    })
  }

  render() {
    // console.log(this.props);
    const {user} = this.props
    const {stars} = this.props
    let star = (<span className="star" onClick={this.handleStar.bind(this)}><Icon icon={starO} size={20} style={{color: 'white'}}/></span>)
    if(stars && stars.length){
      for(let i = 0; i < stars.length; i++){
        if(stars[i].UID === user.UID && stars[i].isStar){
          star = (<span className="star" onClick={this.handleStar.bind(this)}><Icon icon={ic_star} size={20} style={{color: 'white'}}/></span>)
        }
      }
    }
    return (
      <div className={styles.user}>
        <Link to={"/chatwith/" + user.UID}>
          <li className={this.state.active ? "clearfix active" : "clearfix"}>
            <img src={user.photoURL ? user.photoURL : defaulAvatar} alt="avatar" />
            <div className="about">
              <div className="name">{user.display_name}</div>
              <div className="status">
                <span className={user.status === "online" ? "circle online" : "circle offline"}/> {user.status}
                {user.endAt && user.status === "offline" &&
                  <span className="atTime"> {fromNowTimeStamp(user.endAt)}</span>
                }
              </div>
              </div>
              {star}
            </li>
        </Link>
      </div>
    );
  }
}

export default withRouter(
  compose(
    withFirestore,
    connect(mapStateToProps, mapDispatchToProps)
  )(User)
);
