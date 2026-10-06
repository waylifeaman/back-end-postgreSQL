const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const pool = require('../config/database');

class BookmarksService{
    async addBookmarks({user_id, job_id}){
        const id = `bookmarks-${nanoid(16)}`

        const createdAt = new Date().toISOString();
        
        const query = {
            text: 'INSERT INTO bookmarks (id, user_id, job_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, user_id, job_id, createdAt]
        }
        try {
            const result = await pool.query(query);
            return result.rows[0].id;
        } catch (error) {
            if (error.code === '23505') {
                throw new InvariantError('Job ini sudah ada di bookmark Anda');
            }
            if (error.code === '23503') {
                throw new NotFoundError('Job tidak ditemukan');
            }
            throw error;
        }   
    }

    async getBookmarks(userId){
        const query = {
            text:`SELECT b.id, b.user_id, b.job_id, b.created_at,
                j.title, j.description, j.job_type, j.experience_level, j.location_type,
                j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status,
                j.company_id, j.category_id, j.posted_by, c.name AS company_name
            FROM bookmarks b
            JOIN jobs j ON j.id = b.job_id
            LEFT JOIN companies c ON c.id = j.company_id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC`,
            values: [userId]
        }
        const result = await pool.query(query)
        return result.rows;
    }
    async getBookmarksById(id, jobId, userId){
        const query = {
            text: 'SELECT * FROM bookmarks WHERE id = $1 AND job_id = $2 AND user_id = $3',
            values: [id, jobId, userId],
        }
        const result = await pool.query(query)
        if(!result.rows.length){
            throw new NotFoundError('Bookmarks tidak di temukans')
        }
        return result.rows[0];
    }

    async deleteBookmarkByUserAndJob(userId, jobId) {
        const query = {
            text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
            values: [userId, jobId],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Bookmark tidak ditemukan');
        }
    }
}

module.exports = new BookmarksService();