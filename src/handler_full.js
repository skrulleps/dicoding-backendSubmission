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
        return response;
    } catch (err) {
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

module.exports = {addBooksHandler, getBooksHandler};
