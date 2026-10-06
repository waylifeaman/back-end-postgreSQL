exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(150)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    job_type: {
      type: 'VARCHAR(50)',
    },
    experience_level: {
      type: 'VARCHAR(50)',
    },
    location_type: {
      type: 'VARCHAR(50)',
    },
    location_city: {
      type: 'VARCHAR(100)',
    },
    salary_min: {
      type: 'INTEGER',
    },
    salary_max: {
      type: 'INTEGER',
    },
    is_salary_visible: {
      type: 'BOOLEAN',
      default: true,
    },
    status: {
      type: 'VARCHAR(20)',
      default: 'open',
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'RESTRICT',
    },
    posted_by: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
  pgm.createIndex('jobs', 'title');
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};