import React, { Component } from 'react'
import MixItem from './MixItem'
import MixContainer from '../containers/MixContainer'
import { Link } from 'react-router-dom'

class Books extends Component {
  constructor(props) {
    super(props)
    this.createMix = this.createMix.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.creatingMixMode = this.creatingMixMode.bind(this)
    this.renderMixes = this.renderMixes.bind(this)
    this.state = {
      mode: 'default',
      previewing: false,
      bookNotFound: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.props.params) {
      this.setState({mode: 'default'})
    }
  }

  createMix(e) {
    e.preventDefault()
    this.props.createMix(this.state.mixName)
  }

  renderMixItems(user) {
    if (user.Mixes.length) {
      return (
        <span>
          <span className={this.props.params.mix_id ? 'mix-item' : 'mix-item selected'}>
            <Link to={`/${user.username}`}>
              All
            </Link>
            <span className="separator">&bull;</span>
          </span>
          {user.Mixes.map( (mix, i) =>
            <MixItem
              key={ mix.id }
              username={ user.username }
              mix={ mix }
              selected={ this.props.params.mix_id === mix.uid }
              isLast={ i === user.Mixes.length-1 } />
          )}
        </span>
      )
    }
  }

  renderMixes(bookshelf) {
    if (bookshelf.mixes.length) {
      return (
        <span>
          {bookshelf.mixes.map( (mix, i) =>
            <MixContainer
              key= {`mix-${mix.id}`}
              params={this.props.params}
              mix={mix}
              previewBook={this.previewBook}
            />
          )}
        </span>
      )
    }
  }

  previewBook( google_id ) {
    this.setState({previewing: true, bookNotFound: false})
    if ( this.props.app.googleLoaded ) {
      let googlePreview = new google.books.DefaultViewer(this.googlePreviewContainer)
      googlePreview.load( google_id, () => {this.setState({bookNotFound: true})} )
    } else {
      console.log('google hasnt loaded')
    }
  }

  creatingMixMode() {
    if (this.state.mode === 'creatingMix') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'creatingMix'})
    }
  }

  render() {
    return (
      <div>
        <div className='mix-item-list'>
          {this.renderMixItems(this.props.bookshelf.user)}
          {this.props.bookshelf.user.id === this.props.app.user.id &&
            <span className='create-mix button' onClick={this.creatingMixMode}>{this.state.mode === 'creatingMix' ? '-Create New Mix' : '+Create New Mix'}</span>
          }
        </div>
        {this.state.mode === 'creatingMix' &&
          <form onSubmit={this.createMix}>
            <input className="mix-title-field" onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with an unusually specific title" />
            <input type="submit" value="Create Mix"/>
          </form>
        }
        {this.renderMixes(this.props.bookshelf)}
        <div className={this.state.previewing ? 'google-preview-container previewing' : 'google-preview-container'}>
          {this.state.bookNotFound &&
            <div className='preview-message'>Sorry, preview unavailable for this book</div>
          }
          <div className='preview-background' onClick={() => this.setState({previewing: false})} />
          <div className='close-preview' onClick={() => this.setState({previewing: false})}>&times;</div>
          <div className='google-preview' ref={ (el) => this.googlePreviewContainer = el } />
        </div>
      </div>
    )
  }
}

export default Books
