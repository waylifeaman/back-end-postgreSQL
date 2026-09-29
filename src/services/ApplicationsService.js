const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const pool = require('../config/database');

class ApplicationsService {
    async addApplication({ job_id, user_id, status }) {
        const id = `application-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: `INSERT INTO applications (id, job_id, user_id, cover_letter, status, created_at, updated_at)
                   VALUES ($1, $2, $3, $4, 'pending', $5, $5) RETURNING id`,
            values: [id, job_id, user_id, status || null, createdAt],
        };

        try {
            const result = await pool.query(query);
            return result.rows[0].id;
        } catch (error) {
            if (error.code === '23505') {
                throw new InvariantError('Anda sudah melamar pekerjaan ini');
            }
            if (error.code === '23503') {
                throw new NotFoundError('Job tidak ditemukan');
            }
            throw error;
        }
    }

    async getApplications() {
        const result = await pool.query(
            'SELECT id, job_id, user_id, cover_letter, status FROM applications ORDER BY created_at DESC',
        );
        return result.rows;
    }

    async getApplicationsById(id) {
        const query = {
            text: 'SELECT * FROM applications WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Data application tidak ditemukan, id tidak valid');
        }
        return result.rows[0];
    }

    async getApplicationsByUserId(user_id) {
        const query = {
            text: 'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
            values: [user_id],
        };
        const result = await pool.query(query);
        return result.rows;
    }

    async getApplicationsByJobId(job_id) {
        const query = {
            text: 'SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
            values: [job_id],
        };
        const result = await pool.query(query);
        return result.rows;
    }

    async editApplicationsById(id, status) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [status, updatedAt, id],
        };
        const result = await pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Application tidak ditemukan, id tidak valid');
        }
    }

    async deleteApplicationsById(id) {
        const query = {
            text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus application, id tidak ditemukan');
        }
    }
}

module.exports = new ApplicationsService();