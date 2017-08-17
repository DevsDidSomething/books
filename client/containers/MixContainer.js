import React, { Component } from 'react'
import { connect } from 'react-redux'
import Mix from '../components/Mix'
import { deleteMix, searchBook, addBook, updateMix, deleteBook, updateMixOrder, saveConfirmation, pushToPath } from '../actions'

const mapStateToProps = (state, ownProps) => {
  const selected = ownProps.params.mix_id === ownProps.mix.uid
  return {
    errors: state.app.errors,
    searchResults: state.app.searchResults,
    isSearching: state.app.isSearching,
    showSaveConfirmation: state.app.showSaveConfirmation.mix,
    isFetchingBookshelf: state.app.isFetchingBookshelf,
    username: state.bookshelf.user.username,
    canEdit: (state.app.user.id === ownProps.mix.UserId) || state.app.user.admin,
    selected: selected,
    openEdit: (ownProps.params.action === 'edit') || (selected && ownProps.mix.Books.length === 0)
  }
}

const mapDispatchToProps = ({
  deleteMix: deleteMix,
  searchBook: searchBook,
  addBook: addBook,
  updateMix: updateMix,
  deleteBook: deleteBook,
  updateMixOrder: updateMixOrder,
  saveConfirmation: saveConfirmation,
  pushToPath: pushToPath
})

export default connect(mapStateToProps, mapDispatchToProps)(Mix)
