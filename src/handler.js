require('dotenv').config();
const {createClient} = require('@supabase/supabase-js');
const { nanoid } = require('nanoid');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const addBooksHandler = async (req, h) => {
    try {
        const { 
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading
        } = req.payload;

        // Validasi input
        if (!name) {
            console.log('Validation failed: name is missing');
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }

        if (readPage > pageCount) {
            console.log('Validation failed: readPage > pageCount');
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }

        const insertDate = new Date().toISOString();
        const updateDate = new  Date().toISOString();

        const { data, error } = await supabase
        .from('books')
        .insert([{ 
            id: nanoid(), 
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished: pageCount === readPage,
            reading,
            inserted_at: insertDate,
            updated_at: updateDate
        }])
        .select();

        if (error) {
            console.log('Supabase insert error:', error);
            const response = h.response({
                status: 'fail',
                message: 'Buku gagal ditambahkan'
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: data[0].id
            }
        });
        response.code(201);
        console.log(data);
        return response;
    } catch (err) {
        console.error('Error in addBooksHandler:', err);
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: err.message
        });
        response.code(500);
        return response;
    }
}

const getBooksHandler = async (req, h) => {
    try {
        const { data, error } = await supabase
        .from('books')
        .select('id, name, publisher');

        if (error) {
            console.log('Supabase select error:', error);
            const response = h.response({
                status: 'fail',
                message: 'Gagal mengambil data buku'
            });
            response.code(400);
            return response;
        }

       const response = h.response({
            status: 'success',
            data: {
                books: data || []
            }
        });
        response.code(200);
        console.log(data);
        return response;
    } catch (error) {
        console.error('Error in getBooksHandler:', err);
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: err.message
        });
        response.code(500);
        return response;
    }
}

const getBooksByIdHandler = async (req, h) => {
    try {
        const { bookId } = req.params;

        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', bookId);

        if (error || !data) {
            console.log('Supabase select error:', error);
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            });
            response.code(400);
            return response;
        }

        const book = data[0];

        if (!book) {
            return h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            }).code(404);
        }

        const response = h.response({
            status: 'Success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.inserted_at,
                    updatedAt: book.updated_at
                }
            }
        });
        response.code(200);
        return response;
    } catch (error) {
        console.error('Error in getBooksByIdHandler:', error);
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
        response.code(500);
        return response;
    }
}

const editBooksHandler = async (req, h) => {
    try {
        const {bookId} = req.params;
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        } = req.payload;
        
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }

        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }

        const { data: existingBook, error: findError } = await supabase
            .from('books')
            .select('id')
            .eq('id', bookId);

        if (findError) {
            console.error('Error finding book:', findError);
            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                error: findError.message
            });
            response.code(500);
            return response;
        }

        if (!existingBook || existingBook.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan'
            });
            response.code(404);
            return response;
        }

        const updateDate = new Date().toISOString();

        const { error: updateError } = await supabase
            .from('books')
            .update({
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished: pageCount === readPage,
                reading,
                updated_at: updateDate
            })
            .eq('id', bookId);

        if (updateError) {
            console.error('Error updating book:', updateError);
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku'
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response; 
    } catch (error) {
        console.error('Error in editBooksHandler:', error);
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
        response.code(500);
        return response;
    }
}

const deleteBooksHandler = async (req, h) => {
    try {
        const { bookId } = req.params;

        const { data: existingBook, error: findError } = await supabase
            .from('books')
            .select('id')
            .eq('id', bookId);

        if (findError) {
            console.error('Error finding book:', findError);
            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                error: findError.message
            });
            response.code(500);
            return response;
        }

        if (!existingBook || existingBook.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan'
            });
            response.code(404);
            return response;
        }

        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', bookId);

        if (deleteError) {
            console.error('Error deleting book:', deleteError);
            const response = h.response({
                status: 'fail',
                message: 'Gagal menghapus buku'
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    } catch (error) {
        console.error('Error in deleteBooksHandler:', error);
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
        response.code(500);
        return response;
    }
}

module.exports = {addBooksHandler, getBooksHandler, getBooksByIdHandler, editBooksHandler, deleteBooksHandler};
