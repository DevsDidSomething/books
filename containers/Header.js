import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import UserMenu from '../components/UserMenu'
import { login, updateUser, saveConfirmation } from '../actions'
require('../css/Header.scss')

class Header extends Component {
  render() {
    return (
      <div className="nav-container">
        <div className="site-title">
          <h1>
            <Link className='button' to='/'>
              Bookshelf
            </Link>
          </h1>
          {this.props.currentUsername &&
            <h1>
              <span className="divider">
                {'/'}
              </span>
              <Link className='button' to={`/${this.props.currentUsername}`}>
                {this.props.currentUsername}
              </Link>
            </h1>
          }
        </div>
        <UserMenu showSaveConfirmation={this.props.showSaveConfirmation} saveConfirmation={this.props.saveConfirmation} user={this.props.user} updateUser={this.props.updateUser} login={this.props.login} fromHomepage={this.props.fromHomepage} errors={this.props.errors} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.app.user,
  currentUsername: ownProps.params.username,
  fromHomepage: ownProps.params.username ? false : true,
  errors: state.app.errors.user,
  showSaveConfirmation: state.app.showSaveConfirmation.user,
})

const mapDispatchToProps = ({
  login: login,
  updateUser: updateUser,
  saveConfirmation: saveConfirmation
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
