import React, { Component } from 'react'
import SearchResult from './SearchResult'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.addingBookMode = this.addingBookMode.bind(this)
    this.deleteMix = this.deleteMix.bind(this)
    this.addBook = this.addBook.bind(this)
    this.updateMix = this.updateMix.bind(this)
    this.state = {
      mixName: this.props.mix.name,
      mode: 'default',
      searchTerm: ''
    }
  }

  addingBookMode() {
    if (this.state.mode === 'addingBook') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'addingBook'})
    }
  }

  addBook(result){
    this.props.addBook(result, this.props.mix.uid)
    this.setState({searchTerm: ''})
  }

  searchBook(e) {
    e.preventDefault()
    this.props.searchBook(this.state.searchTerm)
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

  updateMix(e){
    e.preventDefault()
    this.props.updateMix(this.props.mix.uid, this.state.mixName)
  }

  deleteMix(){
    this.props.deleteMix(this.props.mix.uid)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mix !== nextProps.mix) {
      this.setState({mixName: nextProps.mix.name})
    }
  }

  render() {
    return (
      <div className='edit-mix-container'>
        {this.props.mix.name !== 'all' &&
          <form onSubmit={this.updateMix}>
            Title: <input type="text" value={this.state.mixName} onChange={(e) => this.setState({mixName: e.target.value})}/>
          </form>
        }
        <div className='search-book button' onClick={this.addingBookMode}>{this.state.mode === 'addingBook' ? '-Add a Book' : '+Add a Book'}</div>
        {this.state.mode === 'addingBook' &&
          <span>
            <form onSubmit={this.searchBook}>
              <input value={this.state.searchTerm} onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" placeholder="Seach by title, author, or keyword" />
            </form>
            {this.renderSearchResults(this.props.searchResults)}
          </span>
        }
        {this.props.mix.name !== 'all' &&
          <div className='delete-mix button' onClick={this.deleteMix}>Delete this mix</div>
        }
      </div>
    )
  }
}

export default Edit
