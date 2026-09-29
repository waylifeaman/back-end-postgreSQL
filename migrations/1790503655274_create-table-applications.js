
export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('applications', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        job_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"jobs"',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        cover_letter: {
            type: 'TEXT',
            notNull: false,
        },
        status: {
            type: 'VARCHAR(20)',
            notNull: true,
            default: 'pending',
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
    pgm.addConstraint('applications', 'unique_applications_user_id_job_id', 'UNIQUE(user_id, job_id)');

    pgm.createIndex('applications', 'user_id');
    pgm.createIndex('applications', 'job_id');
};
export const down = (pgm) => {
    pgm.dropTable('applications');
};
