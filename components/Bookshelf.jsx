import React, { Component } from 'react'
import MixItem from './MixItem'
import Mix from './Mix'

class Books extends Component {
  constructor(props) {
    super(props)
    this.createMix = this.createMix.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.creatingMixMode = this.creatingMixMode.bind(this)
    this.state = {
      mode: 'default',
      previewing: false
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

  renderMixes(user) {
    if (user.Mixes.length) {
      return (
        <span>
          {user.Mixes.map( (mix, i) =>
            <MixItem
              key={ mix.id }
              username={ user.username }
              mix={ mix }
              selected={ this.props.bookshelf.mix.id === mix.id }
              isLast={ i === user.Mixes.length-1 } />
          )}
        </span>
      )
    }
  }

  previewBook( google_id ) {
    this.setState({previewing: true})
    if ( this.props.app.googleLoaded ) {
      let googlePreview = new google.books.DefaultViewer(this.googlePreviewContainer)
      googlePreview.load( google_id )
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
          {this.renderMixes(this.props.bookshelf.user)}
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
        <Mix canEdit={this.props.app.user.id === this.props.bookshelf.user.id} mix={this.props.bookshelf.mix} searchResults={this.props.app.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} deleteBook={this.props.deleteBook} previewBook={this.previewBook} updateMixOrder={this.props.updateMixOrder} />
        <div className={this.state.previewing ? 'google-preview-container previewing' : 'google-preview-container'}>
          <div className='preview-background' onClick={() => this.setState({previewing: false})} />
          <div className='close-preview' onClick={() => this.setState({previewing: false})}>&times;</div>
          <div className='google-preview' ref={ (el) => this.googlePreviewContainer = el } />
        </div>
      </div>
    )
  }
}

export default Books
