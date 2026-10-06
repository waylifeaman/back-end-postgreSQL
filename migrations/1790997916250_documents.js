exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('documents', {
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
    filename: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    original_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    size: {
      type: 'INTEGER',
      notNull: true,
    },
    mime_type: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};