import React, { Component } from 'react'
import Edit from './Edit'
import BookItem from './BookItem'
import Sortable from 'sortablejs'
import { Link } from 'react-router-dom'

require('../css/BookList.scss')

class Mix extends Component {
  constructor(props){
    super(props)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.updateListOrder = this.updateListOrder.bind(this)
    this.removeSaveConfirmation = this.removeSaveConfirmation.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
    this.state = {
      mode: 'default'
    }
  }

  toggleEdit(){
    if (this.state.mode === 'editing') {
      this.setState({mode: 'default'})
      this.props.pushToPath(`/${this.props.username}/mixes/${this.props.mix.uid}/${this.props.mix.webstring}`)
    } else {
      this.props.pushToPath(`/${this.props.username}/mixes/${this.props.mix.uid}/${this.props.mix.webstring}/edit`)
      this.setState({mode: 'editing'})
    }
  }

  updateListOrder(){
    let newOrder = this.sortableList.toArray()
    this.props.updateMixOrder(this.props.mix.uid, newOrder)
  }

  removeSaveConfirmation(){
    this.props.saveConfirmation(false)
  }

  componentDidMount(){
    if (this.props.openEdit) {
      this.setState({mode: 'editing'})
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.selected !== nextProps.selected){
      if (nextProps.openEdit) {
        this.setState({mode: 'editing'})
      } else {
        this.setState({mode: 'default'})
      }
    }
    if (this.bookList && this.sortableList) {
      const bookIDs = this.props.mix.Books.map((b) => b.id.toString())
      if (!_.isEqual(bookIDs, this.sortableList.toArray())) {
        this.sortableList.sort(bookIDs)
      }
    }
    if (nextProps.showSaveConfirmation){
      clearTimeout(this.removeSaveConfirmation)
      setTimeout(this.removeSaveConfirmation, 3000)
    }
  }

  componentDidUpdate(){
    if (this.bookList && this.props.canEdit) {
      if (this.sortableList){
        const bookIDs = this.props.mix.Books.map((b) => b.id.toString())
      }
      if (!this.sortableList) {
        this.sortableList = Sortable.create(this.bookList, {onSort: this.updateListOrder})
      }
      this.sortableList.option("disabled", this.state.mode === 'default')
    }
  }

  renderEditButton(){
    if (this.props.canEdit){
      if (this.props.selected) {
        return(
          <span className="edit-mix button" onClick={this.toggleEdit}>
            {this.state.mode === 'editing' ? '-Edit' : '+Edit'}
          </span>
        )
      } else {
        return(
          <Link to={`/${this.props.username}/mixes/${this.props.mix.uid}/${this.props.mix.webstring}/edit`}>
            <span className="edit-mix button">
              +Edit
            </span>
          </Link>
        )
      }
    }
  }

  render() {
    let editErrors = null
    if (this.props.errors && this.props.errors.bookshelf && this.props.errors.bookshelf.edit) {
      editErrors = this.props.errors.bookshelf.edit
    }
    return (
      <div>
        <div className="mix-title-container">
          <Link to={`/${this.props.username}/mixes/${this.props.mix.uid}/${this.props.mix.webstring}`}>
            <h1 className="mix-title button">{this.props.mix.name}</h1>
          </Link>
          {this.renderEditButton()}
        </div>

        {this.props.canEdit && this.state.mode === 'editing' &&
          <Edit
            showSaveConfirmation={this.props.showSaveConfirmation}
            errors={editErrors} mix={this.props.mix}
            searchResults={this.props.searchResults}
            deleteMix={this.props.deleteMix}
            searchBook={this.props.searchBook}
            addBook={this.props.addBook}
            updateMix={this.props.updateMix}
            toggleEdit={this.toggleEdit}
            isSearching={this.props.isSearching} />
        }
        <div className='book-list-container' ref={(el) => {this.bookList = el}}>
          {!this.props.isFetchingBookshelf &&
            this.props.mix.Books.map(book =>
              <BookItem key={`b-${book.google_id}`} book={book} mix={this.props.mix} deleteBook={this.props.deleteBook} previewBook={this.props.previewBook} canEdit={this.props.canEdit} mode={this.state.mode}/>
            )
          }
        </div>
      </div>
    )
  }
}

export default Mix
