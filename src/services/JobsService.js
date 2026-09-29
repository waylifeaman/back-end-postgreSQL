const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const pool = require('../config/database');

class JobsService {
  async addJobs({
    title, description, job_type, experience_level, location_type, location_city,
    salary_min, salary_max, is_salary_visible, status, company_id, category_id, posted_by,
  }) {
    const id = `job-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO jobs
             (id, title, description, job_type, experience_level, location_type, location_city,
              salary_min, salary_max, is_salary_visible, status, company_id, category_id, posted_by,
              created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$15) RETURNING id`,
      values: [
        id, title, description, job_type || null, experience_level || null,
        location_type || null, location_city || null, salary_min ?? null, salary_max ?? null,
        is_salary_visible !== undefined ? is_salary_visible : true, status || 'open',
        company_id, category_id, posted_by, createdAt,
      ],
    };

    try {
      const result = await pool.query(query);
      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError('Company atau category tidak ditemukan');
      }
      throw error;
    }
  }

  async getJobs({ title, companyName } = {}) {
    const conditions = [];
    const values = [];

    let text = `
      SELECT jobs.*, companies.name AS company_name
      FROM jobs
      LEFT JOIN companies ON companies.id = jobs.company_id
    `;

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`jobs.title ILIKE $${values.length}`);
    }

    if (companyName) {
      values.push(`%${companyName}%`);
      conditions.push(`companies.name ILIKE $${values.length}`);
    }

    if (conditions.length) {
      text += ` WHERE ${conditions.join(' AND ')}`;
    }

    text += ' ORDER BY jobs.created_at DESC';

    const result = await pool.query({ text, values });
    return result.rows;
  }

  async getJobsById(id) {
    const query = {
      text: 'SELECT * FROM jobs WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Job tidak ditemukan, id tidak valid');
    }
    return result.rows[0];
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC',
      values: [companyId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE category_id = $1 ORDER BY created_at DESC',
      values: [categoryId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async editJobsById(id, {
    title, description, job_type, experience_level, location_type, location_city,
    salary_min, salary_max, is_salary_visible, status, company_id, category_id,
  }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `UPDATE jobs SET title = $1, description = $2, job_type = $3, experience_level = $4,
             location_type = $5, location_city = $6, salary_min = $7, salary_max = $8,
             is_salary_visible = $9, status = $10, company_id = $11, category_id = $12, updated_at = $13
             WHERE id = $14 RETURNING id`,
      values: [
        title, description, job_type || null, experience_level || null,
        location_type || null, location_city || null, salary_min ?? null, salary_max ?? null,
        is_salary_visible !== undefined ? is_salary_visible : true, status || 'open',
        company_id, category_id, updatedAt, id,
      ],
    };

    try {
      const result = await pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal memperbarui job, id tidak valid');
      }
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError('Company atau category tidak ditemukan');
      }
      throw error;
    }
  }

  async deleteJobsById(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus job, id tidak ditemukan');
    }
  }

  async verifyJobOwner(id, userId) {
    const query = {
      text: 'SELECT posted_by FROM jobs WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }
    if (result.rows[0].posted_by !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = new JobsService();