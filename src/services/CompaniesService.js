const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const pool = require('../config/database');
const AuthorizationError = require ('../exceptions/AuthorizationError');

class CompaniesService {
    async addCompany({name, description, location, owner_id}){
        const id = `company-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query={
            text: `INSERT INTO companies(id, name, description, location, owner_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING id`,
            values: [id, name, description|| null, location || null, owner_id, createdAt]
        }

        const result = await pool.query(query);
        if(!result.rows.length){
            throw new InvariantError('Gagal menambah perusahaan')
        }
        return result.rows[0].id
    }
    async getCompanies(){
        const result = await pool.query(
            `SELECT id, name, description, location FROM companies ORDER BY created_at DESC`,
        );
        return result.rows;
    }
    async getCompaniesById(id){
        const query = {
            text: `SELECT * FROM companies WHERE id = $1`,
            values: [id]
        }
        const result = await pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Perusahaan tidak di temukan');
        }
        return result.rows[0];
    }
    async editCompaniesById(id, payload){
        const allowedFields = ['name', 'description', 'location'];
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
            text: `UPDATE companies SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id`,
            values,
        }
        const result = await pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbaruhi data perusahaan, id tidak di temukan')
        }
    }

    async deleteCompanyById(id){
        const query = {
            text: `DELETE FROM companies WHERE id = $1 RETURNING id`,
            values: [id]
        };
        const result = await pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Gagal menghapus Perusahaan, id tidak di temukan')
        }
    }

   async verifyCompanyOwner(id, owner_id) {
        const query = {
            text: 'SELECT owner_id FROM companies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Perusahaan tidak ditemukan');
        }

        if (result.rows[0].owner_id !== owner_id) {
            throw new AuthorizationError('Anda tidak berhak mengakses ini');
        }
    }
}

module.exports = new CompaniesService();