const { addBooksHandler, getBooksHandler, getBooksByIdHandler, editBooksHandler, deleteBooksHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBooksByIdHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBooksHandler 
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooksHandler
    }
]

module.exports = routes;