const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'documents');

class DocumentsService {
  async addDocument({ userId, filename, originalName, size, mimeType }) {
    const id = `document-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO documents (id, user_id, filename, original_name, size, mime_type, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, userId, filename, originalName, size, mimeType, createdAt],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getDocuments() {
    const result = await pool.query(
      'SELECT id, filename, original_name, size, mime_type, created_at FROM documents ORDER BY created_at DESC',
    );
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT * FROM documents WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteDocumentById(id) {
    const document = await this.getDocumentById(id);

    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
      values: [id],
    };

    await pool.query(query);

    // Hapus juga file fisiknya dari disk, bukan cuma row di database
    const filePath = path.join(uploadDir, document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = new DocumentsService();