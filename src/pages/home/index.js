import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { saveItem, loadItem } from '../../services/localStorage.services'
import { accountStatus } from '../../constants/localStorage'
import UsersList from '../../components/list-users'
import ChatBox from '../../components/chat-box'
import { updateStatus } from '../../actions'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

const mapDispatchToProps = (dispatch) => {
  return{
    updateStatus: () => dispatch(updateStatus())
  }
}

const mapStateToProps = (state) => {
  return{}
}

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      showDropdown: false
    }
  }

  componentDidMount(){
    if(loadItem('account_status') === accountStatus.UNLOGGED){
      this.props.history.push('/login')
    }
    else{
      saveItem('account_status', accountStatus.LOGGED)
      document.body.style.overflow = 'hidden'
      this.props.updateStatus()
    }
  }

  render() {
    // console.log(this.props);
    return (
      <div className={styles.homePage}>
        {/*<button className="btn btn-primary" onClick={this.handleLogout.bind(this)}>Đăng xuất</button>*/}
        <div className="container-app clearfix">
          <UsersList />
          <ChatBox />
        </div>
        {/* end container */}
      </div>
    );
  }
}

export default withRouter(
  compose(
    firestoreConnect(['users', 'chatbox']),
    connect(mapStateToProps, mapDispatchToProps)
  )(Home)
);
