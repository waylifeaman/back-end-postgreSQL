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
      SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
            jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
            jobs.salary_min, jobs.salary_max, jobs.status, companies.name AS company_name
      FROM jobs
      LEFT JOIN companies ON companies.id = jobs.company_id
    `;
    // let text = `
    //   SELECT jobs.id, jobs.company_id, jobs.category_id, jobs.title, jobs.description,
    //         jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
    //         jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status, companies.name AS company_name
    //   FROM jobs
    //   LEFT JOIN companies ON companies.id = jobs.company_id
    // `;


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

  async editJobsById(id, payload) {
    const allowedFields = [
      'title', 'description', 'job_type', 'experience_level', 'location_type',
      'location_city', 'salary_min', 'salary_max', 'is_salary_visible', 'status',
      'company_id', 'category_id',
    ];

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
      text: `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id`,
      values,
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