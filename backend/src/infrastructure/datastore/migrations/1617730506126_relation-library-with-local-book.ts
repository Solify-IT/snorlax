import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('local_books', {
    library_id: {
      type: 'uuid',
      notNull: true,
    },
  });
  pgm.addConstraint('local_books', 'library_local_books_fk', {
    foreignKeys: {
      columns: 'library_id',
      references: 'libraries(id)',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint('local_books', 'library_local_books_fk');
  pgm.dropColumn('local_books', 'library_id', {
    cascade: true,
  });
}
