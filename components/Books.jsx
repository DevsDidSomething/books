import React, { Component } from 'react'
import SearchResult from './SearchResult'
import BookItem from './BookItem'
import MixItem from './MixItem'
import _ from 'lodash'

class Books extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.createMix = this.createMix.bind(this)
    this.addBook = this.addBook.bind(this)
    this.deleteBook = this.deleteBook.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.creatingMixMode = this.creatingMixMode.bind(this)
    this.addingBookMode = this.addingBookMode.bind(this)
    this.deleteMix = this.deleteMix.bind(this)
    this.state = {
      mode: 'default',
      previewing: false,
      selectedMix: null,
      searchTerm: ''
    }
  }

  searchBook(e) {
    e.preventDefault();
    this.props.searchBook(this.state.searchTerm)
  }

  createMix(e) {
    e.preventDefault();
    this.props.createMix(this.state.mixName)
  }

  addBook(result){
    this.props.addBook(result, this.props.match.params.mix_id)
    this.setState({searchTerm: ''})
  }

  deleteBook(bookID){
    this.props.deleteBook(bookID, this.props.match.params.mix_id)
  }

  renderSearchResults(results) {
    if (results.length) {
      return (
        <ul>
          {results.map(result =>
            <SearchResult key={`r-${result.google_id}`} result={result} onClick={this.addBook} />
          )}
        </ul>
      )
    }
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

  renderMixes(mixes) {
    if (mixes.length) {
      return (
        <span>
          {mixes.map( (mix, i) =>
            <MixItem
              key={ mix.id }
              mix={ mix }
              selected={ this.state.mix === mix }
              isLast={ i === mixes.length-1 } />
          )}
        </span>
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const mixID = parseInt(nextProps.match.params.mix_id)
    const oldMixID = this.state.mix ? this.state.mix.id : null
    if (this.props.app.mixes.length && (mixID !== oldMixID) ) {
      const mix = _.find(this.props.app.mixes, {'id': mixID})
      this.setState({mix: mix})
      this.props.getBooks(mix.id)
    }
  }

  componentWillMount(x){
    this.props.getMixes()
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

  addingBookMode() {
    if (this.state.mode === 'addingBook') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'addingBook'})
    }
  }

  deleteMix(){
    if (this.state.mix) {
      this.props.deleteMix(this.state.mix.id)
    }
  }

  render() {
    return (
      <div>
        <div className="nav-container">
          <h1>
            Bookshelf
          </h1>
        </div>
        <div className='mix-item-list'>
          {this.renderMixes(this.props.app.mixes)}
          <span className='create-mix-button' onClick={this.creatingMixMode}>+ Create new mix</span>
        </div>
        {this.state.mode === 'creatingMix' &&
          <form onSubmit={this.createMix}>
            <input onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with a good title" />
          </form>
        }
        <div className='edit-mix-container'>
          Title: <input value={this.state.mix ? this.state.mix.name : ''}/>
          <div className='search-book button' onClick={this.addingBookMode}>+ Add a book</div>
          {this.state.mode === 'addingBook' &&
            <span>
              <form onSubmit={this.searchBook}>
                <input value={this.state.searchTerm} onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" placeholder="Seach by title, author, or keyword" />
              </form>
              {this.renderSearchResults(this.props.app.searchResults)}
            </span>
          }
          <div className='delete-mix button' onClick={this.deleteMix}>Delete this mix</div>

        </div>
        {this.renderBooks(this.props.app.books)}
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
