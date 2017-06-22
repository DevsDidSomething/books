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
          {this.props.params.username &&
            <h1>
              <span className="divider">
                {'/'}
              </span>
              <Link className='button' to={`/${this.props.params.username}`}>
                {this.props.params.username}
              </Link>
            </h1>
          }
        </div>
        <UserMenu
          showSaveConfirmation={this.props.showSaveConfirmation}
          saveConfirmation={this.props.saveConfirmation}
          user={this.props.user}
          updateUser={this.props.updateUser}
          login={this.props.login}
          params={this.props.params}
          fromHomepage={this.props.params.username ? false : true}
          errors={this.props.errors} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.app.user,
  errors: state.app.errors.user,
  showSaveConfirmation: state.app.showSaveConfirmation.user,
})

const mapDispatchToProps = ({
  login: login,
  updateUser: updateUser,
  saveConfirmation: saveConfirmation
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
