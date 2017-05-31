import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Root from '../components/Root'
import * as AppActions from '../actions'

const mapStateToProps = (state) => ({
  app: state
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AppActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
