const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const pool = require('../config/database');

class CategoriesService{
    async addCategory({ name }) {
        const id = `category-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO categories (id, name, created_at, updated_at) VALUES ($1, $2, $3, $3) RETURNING id',
            values: [id, name, createdAt],
        };

        try {
            const result = await pool.query(query);
            return result.rows[0].id;
        } catch (error) {
            if (error.code === '23505') {
                throw new InvariantError('Nama category sudah digunakan');
            }
            throw error;
        }
    }
    async  getCategories(){
        const result = await pool.query(
            `SELECT id, name FROM categories ORDER BY created_at DESC`            
        )
        return result.rows;
    }

    async getCategoryById(id){
        const query = {
            text:`SELECT * FROM categories WHERE id = $1`,
            values: [id]
        }
        const result = await pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Category tidak di temukan')
        }
        return result.rows[0]
    }

    async editCategoryById(id, payload) {
        const allowedFields = ['name'];
        const fieldsToUpdate = Object.keys(payload).filter((key) => allowedFields.includes(key));
        if (!fieldsToUpdate.length) {
            throw new InvariantError('Tidak ada data yang diperbarui');
        }

        const updatedAt = new Date().toISOString();
        const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
        const values = fieldsToUpdate.map((field) => payload[field]);

        setClauses.push(`updated_at = $${values.length + 1}`);
        values.push(updatedAt);
        values.push(id);

        const query = {
            text: `UPDATE categories SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id`,
            values
        };
        const result = await pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui category, id tidak ditemukan');
        }    
    }

    async deleteCategoryById(id){
        const query = {
            text: `DELETE FROM categories WHERE id = $1 RETURNING id`,
            values:  [id]
        }
        const result = await pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Gagal menghapus category, id tidak ditemukan')
        }
    }
}

module.exports = new CategoriesService();