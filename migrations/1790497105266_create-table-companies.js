
    export const shorthands = undefined;
    export const up = (pgm) => {
        pgm.createTable('companies',{
            id:{
                type:'VARCHAR(50)',
                primaryKey: true,
            },
            name: {
                type: 'VARCHAR(100)',
                notNull: true,
            },
            description: {
                type: 'TEXT',
                notNull: false,
            },
            location: {
                type: 'VARCHAR(100)',
                notNull: false,
            },
            owner_id: {
                type: 'VARCHAR(50)',
                notNull: true,
                references: 'users',
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
        })
        pgm.createIndex('companies', 'owner_id');
    };

    export const down = (pgm) => {
        pgm.dropTable('companies')
    };
