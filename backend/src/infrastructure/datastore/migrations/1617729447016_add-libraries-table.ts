import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('libraries', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    phone_number: {
      type: 'varchar(20)',
      notNull: true,
    },
    email: {
      type: 'varchar(50)',
      notNull: true,
    },
    state: {
      type: 'varchar(50)',
      notNull: true,
    },
    city: {
      type: 'varchar(50)',
      notNull: true,
    },
    address: {
      type: 'varchar(100)',
      notNull: true,
    },
    in_charge: {
      type: 'varchar(50)',
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
  });
  pgm.createIndex('libraries', 'name');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('libraries', 'name');
  pgm.dropTable('libraries');
}
