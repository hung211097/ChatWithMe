import React, { Component } from 'react';
import styles from'./index.scss';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { logout } from '../../actions'
import { saveItem } from '../../services/localStorage.services'

const mapDispatchToProps = (dispatch) => {
  return{
    logout: () => dispatch(logout())
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
      notLogged: true
    }
  }

  componentDidMount(){
    saveItem('account_status', 'logged')
  }

  UNSAFE_componentWillReceiveProps(props){
    if(this.state.notLogged !== props.notLogged){
      this.setState({
        notLogged: props.notLogged
      })
    }
    // console.log("EARLY", props);
  }

  handleLogout(){
    this.props.logout()
    this.props.history.push('/login')
  }

  render() {
    if(this.state.notLogged){
      return <Redirect to='/login' />
    }
    return (
      <div className={styles.homePage}>
        <button className="btn btn-primary" onClick={this.handleLogout.bind(this)}>Đăng xuất</button>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
