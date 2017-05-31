import React, { Component } from 'react'
import SearchResult from './SearchResult'
import BookItem from './BookItem'
if ( process.env.BROWSER ) require('../css/App.scss');

class Counter extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.state = {
      searchTerm: null
    }
  }

  searchBook(e) {
    e.preventDefault();
    this.props.searchBook(this.state.searchTerm)
  }

  renderSearchResults(results) {
    if (results.length) {
      return (
        <ul>
          {results.map(result =>
            <SearchResult key={result.google_id} result={result} onClick={this.props.addBook} />
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
            <BookItem key={`b-${book.google_id}`} book={book} />
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
        {this.renderSearchResults(this.props.app.searchResults)}
        <form onSubmit={this.searchBook}>
          <input onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" value={this.state.password} />
        </form>
        {this.renderBooks(this.props.app.books)}
      </div>
    )
  }
}

export default Counter
