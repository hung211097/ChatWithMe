import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import {starO} from 'react-icons-kit/fa/starO'
import {star} from 'react-icons-kit/fa/star'
import defaulAvatar from '../../images/default-avatar.png'
import {withFirestore} from 'react-redux-firebase'
import {compose} from 'redux'

const mapDispatchToProps = (dispatch) => {
  return{

  }
}

const mapStateToProps = (state) => {
  return{

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
    }
    else{
      this.setState({
        active: false
      })
    }
  }
  UNSAFE_componentWillReceiveProps(props){
    if(props.match && props.match.params.id === this.props.user.UID){
      this.setState({
        active: true
      })
    }
    else{
      this.setState({
        active: false
      })
    }
  }

  render() {
    const {user} = this.props
    return (
      <div className={styles.user}>
        <Link to={"/chatwith/" + user.UID}>
          <li className={this.state.active ? "clearfix active" : "clearfix"}>
            <img src={user.photoURL ? user.photoURL : defaulAvatar} alt="avatar" />
            <div className="about">
              <div className="name">{user.display_name}</div>
              <div className="status">
                <span className={user.status === "online" ? "circle online" : "circle offline"}/> {user.status}
                </div>
              </div>
              <span className="star"><Icon icon={starO} size={20} style={{color: 'white'}}/></span>
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
