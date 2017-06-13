import React, { Component } from 'react'
import BookItem from './BookItem'
import MixItem from './MixItem'
import Mix from './Mix'
import LoginForm from './LoginForm'
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
    const mixID = parseInt(params.mix_id)
    const username = params.username
    const bookshelf = this.props.bookshelf
    if (_.isEmpty(bookshelf)) {
      this.props.getBookshelf(username, mixID)
    } else {
      if ( (bookshelf.user.username !== username) || (bookshelf.mix.id !== mixID)) {
        this.props.getBookshelf(username, mixID)
      }
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
        <div className="nav-container">
          <h1>
            Bookshelf
          </h1>
          {this.props.app.user &&
            <a href="/logout">logout</a>
          }
          {!this.props.app.user &&
            <LoginForm login={this.props.login} />
          }
        </div>
        <div className='mix-item-list'>
          {!_.isEmpty(this.props.bookshelf) &&
            this.renderMixes(this.props.bookshelf.user)
          }
          <span className='create-mix-button' onClick={this.creatingMixMode}>+ Create new mix</span>
        </div>
        {this.state.mode === 'creatingMix' &&
          <form onSubmit={this.createMix}>
            <input onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with a good title" />
          </form>
        }
        {!_.isEmpty(this.props.bookshelf) &&
          <span>
            <Mix mix={this.props.bookshelf.mix} searchResults={this.props.app.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} />
            {this.renderBooks(this.props.bookshelf.mix.Books)}
          </span>
        }
        <div className={this.state.previewing ? 'google-preview-container previewing' : 'google-preview-container'}>
          <div className='preview-background' onClick={() => this.setState({previewing: false})} />
          <div className='close-preview' onClick={() => this.setState({previewing: false})}>x</div>
          <div className='google-preview' ref={ (el) => this.googlePreviewContainer = el } />
        </div>
      </div>
    )
  }
}

export default Books
