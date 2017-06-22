const _ = require( 'lodash' )

const createWebString = (text) => {
  if (text.length > 50) {
    text = text.substring(0,50)
  }
  text = text.replace(/\s/g, '-')
  text = encodeURIComponent(text)
  return text
}

const randId = () => {
  return Math.random().toString(36).substr(2, 5)
}

const validateFields = (f, mode) => {
  let errors = {}
  if (mode === 'login' || mode === 'signup') {
    if (_.isEmpty(f.username)){
      errors['username'] = "Username can't be blank"
    } else if (f.username.match(/\W/g)){
      errors['username'] = "Username cannot have special characters"
    } else if (f.username.length < 3) {
      errors['username'] = "Please use at least 3 letters"
    } else if (f.username === 'login' || f.username === 'logout' || f.username === 'signup' || f.username === 'static' || f.username === 'public') {
      errors['username'] = "I see what you're doing but please don't"
    }
  }

  if (mode === 'login' || mode === 'signup') {
    if (_.isEmpty(f.password)){
      errors['password'] = "Password can't be blank"
    } else if (f.password.length < 6) {
      errors['password'] = "Please use at least 6 characters"
    }
  }

  if (mode === 'update' && !_.isEmpty(f.password)) {
    if (f.password.length < 6) {
      errors['password'] = "Please use at least 6 characters"
    } else if (f.password !== f.passwordConfirm) {
      errors['password'] = "Passwords don't match"
    }
  }

  if (mode === 'signup' || mode === 'update') {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (_.isEmpty(f.email)){
      errors['email'] = "Email can't be blank"
    } else if (!f.email.match(re)){
      errors['email'] = "Not a valid email"
    }
  }

  return errors
}

const userData = (user) => {
  return {id: user.id, username: user.username, email: user.email, admin: user.username === 'kray'}
}

module.exports = {
  userData: userData,
  createWebString: createWebString,
  randId: randId,
  validateFields: validateFields
}
