function (doc) {
  if (doc.type === 'artikel') emit(doc._id, doc)
}