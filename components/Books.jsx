import React, { Component } from 'react'
import MixItem from './MixItem'
import Mix from './Mix'
import _ from 'lodash'

class Books extends Component {
  constructor(props) {
    super(props)
    this.createMix = this.createMix.bind(this)
    this.deleteBook = this.deleteBook.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.creatingMixMode = this.creatingMixMode.bind(this)
    this.state = {
      mode: 'default',
      previewing: false,
      selectedMix: null
    }
  }

  createMix(e) {
    e.preventDefault()
    this.props.createMix(this.state.mixName)
  }

  deleteBook(bookID){
    this.props.deleteBook(bookID, this.props.match.params.mix_id)
  }

  renderBooks(books) {
    if (books.length) {
      return (
        <div>
          {books.map(book =>
            <BookItem key={`b-${book.google_id}`} book={book} deleteBook={this.deleteBook} previewBook={this.previewBook}/>
          )}
        </div>
      )
    }
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

  componentWillReceiveProps(nextProps) {
    const params = nextProps.match.params
    if (params !== this.props.match.params) {
      this.setState({mode: 'default'})
    }
    if (!nextProps.app.isFetchingBookshelf) {
      const mixUid = params.mix_id || 0
      const username = params.username
      const bookshelf = this.props.bookshelf
      if (_.isEmpty(bookshelf)) {
        this.props.getBookshelf(username, mixUid)
      } else {
        if ( (bookshelf.user.username !== username) || (bookshelf.mix.uid !== mixUid) ) {
          //this means that we are currently showing the 'all' and should be
          if (!(bookshelf.mix.name === 'All' && mixUid === 0)) {
            this.props.getBookshelf(username, mixUid)
          }
        }
      }
    }
    if (nextProps.app.pushedPath) {
      this.props.history.push(nextProps.app.pushedPath)
      this.props.pushToPath(null)
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
        {!_.isEmpty(this.props.bookshelf) &&
          <span>
            <div className='mix-item-list'>
              {`${this.props.bookshelf.user.username}'s mixes: `}
              {this.renderMixes(this.props.bookshelf.user)}
              {this.props.bookshelf.user.id === this.props.app.user.id &&
                <span className='create-mix button' onClick={this.creatingMixMode}>{this.state.mode === 'creatingMix' ? '-Create New Mix' : '+Create New Mix'}</span>
              }
            </div>
            {this.state.mode === 'creatingMix' &&
              <form onSubmit={this.createMix}>
                <input className="mix-title-field" onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with a weird title" />
                <input type="submit" value="Create Mix"/>
              </form>
            }
            <Mix canEdit={this.props.app.user.id === this.props.bookshelf.user.id} mix={this.props.bookshelf.mix} searchResults={this.props.app.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} deleteBook={this.deleteBook} previewBook={this.previewBook} />
          </span>
        }
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
