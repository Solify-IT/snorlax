import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('local_books', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    isbn: {
      type: 'varchar(13)',
      notNull: true,
    },
    price: {
      type: 'numeric',
      notNull: true,
    },
  });
  pgm.createIndex('local_books', 'isbn');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('local_books', 'isbn');
  pgm.dropTable('local_books', {
    cascade: true,
  });
}
