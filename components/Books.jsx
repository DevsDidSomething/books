import React, { Component } from 'react'
import Edit from './Edit'
import BookItem from './BookItem'
import MixItem from './MixItem'
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

  renderMixes(mixes) {
    if (mixes.length) {
      return (
        <span>
          {mixes.map( (mix, i) =>
            <MixItem
              key={ mix.id }
              mix={ mix }
              selected={ this.state.selectedMix === mix }
              isLast={ i === mixes.length-1 } />
          )}
        </span>
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const mixID = parseInt(nextProps.match.params.mix_id)
    const oldMixID = this.state.selectedMix ? this.state.selectedMix.id : null
    if (this.props.app.mixes.length && (mixID !== oldMixID) ) {
      const mix = _.find(this.props.app.mixes, {'id': mixID})
      this.setState({selectedMix: mix})
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

  render() {
    console.log(this.state.selectedMix)
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
        {this.state.selectedMix &&
          <Edit mix={this.state.selectedMix} searchResults={this.props.app.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} />
        }
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
