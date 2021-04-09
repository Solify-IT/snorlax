import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('movements', {
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
    local_book_id: {
      type: 'uuid',
      notNull: true,
    },
    amount: {
      type: 'numeric',
      notNull: true,
    },
    is_loan: {
      type: 'boolean',
      notNull: true,
    },
  });
  pgm.addConstraint('movements', 'local_book_movement_fk', {
    foreignKeys: {
      columns: 'local_book_id',
      references: 'local_books(id)',
    },
  });
  pgm.addIndex('movements', 'is_loan');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('movements', 'is_loan');
  pgm.dropConstraint('movements', 'local_book_movement_fk');
  pgm.dropTable('movements', {
    cascade: true,
  });
}
