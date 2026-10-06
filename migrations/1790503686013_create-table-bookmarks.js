export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('bookmarks', {
    id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
    },
    user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"users"',
        onDelete: 'CASCADE',
    },
    job_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"jobs"',
        onDelete: 'CASCADE',
    },
    created_at: {
        type: 'TEXT',
        notNull: true,
    },
  });
    pgm.addConstraint('bookmarks', 'unique_bookmarks_user_id_job_id', 'UNIQUE(user_id, job_id)');

    pgm.createIndex('bookmarks', 'user_id');
};

export const down = (pgm) => {
    pgm.dropTable('bookmarks');
};
