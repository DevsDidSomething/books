import React, { Component } from 'react'

export default class BookItem extends Component {
  constructor(props) {
    super(props)
    this.deleteBook = this.deleteBook.bind(this)
  }

  deleteBook(e) {
    e.stopPropagation()
    this.props.deleteBook(this.props.book.id)
  }

  render() {
    return (
      <div
        className='book-item'
        style={{ backgroundImage: `url(${this.props.book.src})` }}
        onClick={() => this.props.previewBook(this.props.book.google_id)}>
        <span
          className='delete-book'
          onClick={this.deleteBook}>
          x
        </span>
      </div>
    )
  }
}
