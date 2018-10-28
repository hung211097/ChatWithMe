import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { logout } from '../../actions'
import { saveItem, loadItem } from '../../services/localStorage.services'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: (redirectCallback) => dispatch(logout(redirectCallback))
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return{
    notLogged: state.firebase.auth.isEmpty
  }
}

class Register extends Component {
  static propTypes = {
    notLogged: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.state = {

    }
  }

  componentDidMount(){
    if(this.props.notLogged && loadItem('account_status') === 'unlogged'){
      this.props.history.push('/login')
    }
    else{
      saveItem('account_status', 'logged')
    }
  }

  handleLogout(){
    this.props.logout(() => {
      this.props.history.push('/login')
    })
  }

  render() {
    return (
      <div className={styles.homePage}>
        <button className="btn btn-primary" onClick={this.handleLogout.bind(this)}>Đăng xuất</button>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
