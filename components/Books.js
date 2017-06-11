import React, { Component } from 'react'
import SearchResult from './SearchResult'
import BookItem from './BookItem'
import MixItem from './MixItem'

class Counter extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.createMix = this.createMix.bind(this)
    this.addBook = this.addBook.bind(this)
    this.state = {
      searchTerm: null
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
    this.props.addBook(result, this.props.match.params.filter)
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
            <BookItem key={`b-${book.google_id}`} book={book} deleteBook={this.props.deleteBook} />
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

  render() {
    return (
      <div>
        <h1>
          Bookshelf
        </h1>
        {this.renderMixes(this.props.app.mixes)}
        <form onSubmit={this.createMix}>
          <input onChange={(e) => this.setState({mixName: e.target.value})} type="text" />
        </form>
        <form onSubmit={this.searchBook}>
          <input onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" />
        </form>
        {this.renderSearchResults(this.props.app.searchResults)}
        {this.renderBooks(this.props.app.books)}
      </div>
    )
  }
}

export default Counter
