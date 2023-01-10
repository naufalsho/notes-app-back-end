const { nanoid } = require('nanoid');
const notes = require('./notes');

// POST untuk simpan notes
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const now = new Date();
  const isoString = now.toISOString();
  // const createdAt = new Date().toISOString();
  const createdAt = isoString;
  const updateAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updateAt,
  };

  notes.push(newNote);

  // menentukan apakah newNote sudah masuk ke dalam array notes?
  // Mudah saja! Kita bisa memanfaatkan method filter()
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // menentukan respons yang diberikan server.
  // Jika isSuccess bernilai true, maka beri respons berhasil.
  // Jika false, maka beri respons gagal.
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET untuk mendapatkan data dari hasil POST
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// GET by id sepesifik GET dari id nya
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params; // dapatkan nilai ID

  // selanjutnya, dapatkan objek dari array notes dari ID tersebut.
  const note = notes.filter((n) => n.id === id)[0];

  // kembalikan fungsi handler dengan data berserta objek note didalamnya
  // dan memastikan objek note tidak bernilai Undefined.
  // bila undefined, kembalikan dengan respons gagal.
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// PUT by id, Update berdasarjan ID
const editNoteByIdHandler = (request, h) => {
  // dapatkan ID
  const { id } = request.params;

  // dapatkan notes terbaru dari client melalui body request
  const { title, tags, body } = request.payload;

  // update nilai updatedAt, dengan mendapatkan nilai terbari dengan new Date().toISOString()
  const now = new Date();
  const isoString = now.toISOString();
  const updateAt = isoString;

  // dapatkan index array pada object notes sesuai ID, dengan method array findIndex()
  const index = notes.findIndex((note) => note.id === id);

  // Bila note dengan id yang dicari ditemukan,
  // maka index akan bernilai array index dari objek catatan yang dicari.
  // Namun bila tidak ditemukan, maka index bernilai -1.
  // Jadi, kita bisa menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else
  if (index !== -1) {
    // Spread operator pada kode di atas digunakan
    // untuk mempertahankan nilai notes[index] yang tidak perlu diubah.
    // Jika Anda butuh mengingat kembali bagaimana spread operator bekerja,
    // silakan simak dokumentasi : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    // response status success
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // response status fail
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE by ID
const deleteNoteByIdHandler = (request, h) => {
  // dapatkan id
  const { id } = request.params;

  // dapatkan index dari objek notes sesuai ID
  const index = notes.findIndex((note) => note.id === id);

  // Lakukan pengecekan terhadap nilai index,
  // pastikan nilainya tidak -1 bila hendak menghapus catatan.
  // Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice().
  if (index !== -1) {
    notes.splice(index, 1);

    // status respons success
    const response = h.respons({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // response status gagal
  const response = h.respons({
    status: 'fail',
    message: 'Catatan gagal dihapus. ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
