import React, { Component } from 'react'

export default class BookItem extends Component {
  constructor(props) {
    super(props)
    this.deleteBook = this.deleteBook.bind(this)
  }

  deleteBook(e) {
    e.stopPropagation()
    this.props.deleteBook(this.props.book.id, this.props.mix.uid)
  }

  render() {
    return (
      <div
        className={this.props.mode === 'editing' ? 'book-item editing' : 'book-item'}
        style={{ backgroundImage: `url(${this.props.book.large_image_src})` }}
        onClick={() => this.props.previewBook(this.props.book.google_id)}>
        <div className='book-info'>
          <div className='book-item-title'>{this.props.book.title}</div>
          <div>by {this.props.book.author}</div>
          <div className='book-item-instruction'>Click to open</div>
        </div>
        {this.props.canEdit &&
          <div className='book-edit-info'>
            <span
              className='delete-book'
              onClick={this.deleteBook}>
              &times;
            </span>
            <div className='book-item-instruction'>Drag to Reorder</div>
          </div>
        }
      </div>
    )
  }
}
