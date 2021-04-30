import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('catalogue', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    title: {
      type: 'varchar(70)',
      notNull: true,
    },
    isbn: {
      type: 'varchar(13)',
      notNull: true,
      unique: true,
    },
    unitary_cost: {
      type: 'numeric',
    },
    author: {
      type: 'varchar(70)',
    },
    editoral: {
      type: 'varchar(50)',
    },
    area: {
      type: 'varchar(20)',
    },
    theme: {
      type: 'varchar(20)',
    },
    sub_theme: {
      type: 'varchar(20)',
    },
    collection: {
      type: 'varchar(20)',
    },
    provider: {
      type: 'varchar(20)',
    },
    type: {
      type: 'varchar(20)',
    },
    cover: {
      type: 'varchar(20)',
    },
    sub_category: {
      type: 'varchar(20)',
    },
    distribuitor: {
      type: 'varchar(20)',
    },
    synopsis: {
      type: 'text',
    },
    pages: {
      type: 'numeric',
    },
  });

  pgm.createIndex('catalogue', ['isbn', 'title', 'author']);

  pgm.addConstraint('local_books', 'catalogue_book_local_book_fk', {
    foreignKeys: {
      columns: 'isbn',
      references: 'catalogue(isbn)',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint('local_books', 'catalogue_book_local_book_fk');

  pgm.dropIndex('catalogue', ['isbn', 'title', 'author']);

  pgm.dropTable('catalogue');
}