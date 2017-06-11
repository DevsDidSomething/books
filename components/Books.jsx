import React, { Component } from 'react'
import SearchResult from './SearchResult'
import BookItem from './BookItem'
import MixItem from './MixItem'

class Books extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.createMix = this.createMix.bind(this)
    this.addBook = this.addBook.bind(this)
    this.deleteBook = this.deleteBook.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.state = {
      previewing: false,
      mixID: null,
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
        <ul>
          {books.map(book =>
            <BookItem key={`b-${book.google_id}`} book={book} deleteBook={this.deleteBook} previewBook={this.previewBook}/>
          )}
        </ul>
      )
    }
  }

  renderMixes(mixes) {
    if (mixes.length) {
      return (
        <ul>
          {mixes.map(mix =>
            <MixItem key={mix.id} mix={mix} deleteMix={this.props.deleteMix}/>
          )}
        </ul>
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const mixID = nextProps.match.params.mix_id
    if (mixID !== this.state.mixID) {
      this.setState({mixID: mixID})
      this.props.getBooks(mixID)
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

  render() {
    return (
      <div>
        <h1>
          Bookshelf
        </h1>
        {this.renderMixes(this.props.app.mixes)}
        <form onSubmit={this.createMix}>
          <input onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with a good title" />
        </form>
        <form onSubmit={this.searchBook}>
          <input value={this.state.searchTerm} onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" placeholder="Seach by title, author, or keyword" />
        </form>
        {this.renderSearchResults(this.props.app.searchResults)}
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
