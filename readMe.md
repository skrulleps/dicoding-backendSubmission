# Buku API

API ini menyediakan layanan untuk mengelola data buku dengan fitur:

- Menambahkan buku baru
- Menampilkan seluruh buku
- Menampilkan detail buku berdasarkan ID
- Mengubah data buku berdasarkan ID
- Menghapus buku berdasarkan ID

## Endpoints

### 1. Tambah Buku

- Method: POST
- URL: /books
- Body Request:

```json
{
  "name": "string",
  "year": "number",
  "author": "string",
  "summary": "string",
  "publisher": "string",
  "pageCount": "number",
  "readPage": "number",
  "reading": "boolean"
}
```

- Response:

  - 201 Created (berhasil menambahkan buku)
  - 400 Bad Request (validasi gagal)

### 2. Tampilkan Semua Buku

- Method: GET
- URL: /books
- Response:

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "string",
        "name": "string",
        "publisher": "string"
      }
    ]
  }
}
```

### 3. Tampilkan Detail Buku

- Method: GET
- URL: /books/{bookId}
- Response:

  - 200 OK (buku ditemukan)
  - 404 Not Found (buku tidak ditemukan)

### 4. Ubah Data Buku

- Method: PUT
- URL: /books/{bookId}
- Body Request:

```json
{
  "name": "string",
  "year": "number",
  "author": "string",
  "summary": "string",
  "publisher": "string",
  "pageCount": "number",
  "readPage": "number",
  "reading": "boolean"
}
```

- Response:

  - 200 OK (berhasil mengubah buku)
  - 400 Bad Request (validasi gagal)
  - 404 Not Found (buku tidak ditemukan)

### 5. Hapus Buku

- Method: DELETE
- URL: /books/{bookId}
- Response:

  - 200 OK (berhasil menghapus buku)
  - 404 Not Found (buku tidak ditemukan)

## Catatan

- Pastikan environment variable `SUPABASE_URL` dan `SUPABASE_KEY` sudah diatur dengan benar.
- Gunakan tools seperti Postman atau curl untuk menguji endpoint.
- Semua response menggunakan format JSON dengan properti `status` dan `message` atau `data`.
