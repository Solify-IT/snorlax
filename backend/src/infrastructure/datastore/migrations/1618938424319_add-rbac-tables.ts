import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('roles', {
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
    name: {
      type: 'varchar(20)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: false,
    },
  });

  pgm.createTable('permissions', {
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
    name: {
      type: 'varchar(20)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: false,
    },
  });

  pgm.createTable('roles_permissions', {
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
    role_id: {
      type: 'uuid',
      notNull: true,
    },
    permission_id: {
      type: 'uuid',
      notNull: true,
    },
  });
  pgm.addConstraint('roles_permissions', 'role_fk', {
    foreignKeys: {
      columns: 'role_id',
      references: 'roles(id)',
    },
  });
  pgm.addConstraint('roles_permissions', 'permission_fk', {
    foreignKeys: {
      columns: 'permission_id',
      references: 'permissions(id)',
    },
  });

  pgm.createTable('users', {
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
    email: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
    display_name: {
      type: 'varchar(50)',
      notNull: true,
    },
    disabled: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    role_id: {
      type: 'uuid',
      notNull: true,
    },
    library_id: {
      type: 'uuid',
      notNull: true,
    },
  });
  pgm.addConstraint('users', 'user_role_fk', {
    foreignKeys: {
      columns: 'role_id',
      references: 'roles(id)',
    },
  });
  pgm.addConstraint('users', 'user_library_fk', {
    foreignKeys: {
      columns: 'library_id',
      references: 'libraries(id)',
    },
  });
  pgm.addIndex('users', ['email', 'display_name']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('users', ['email', 'display_name']);
  pgm.dropTable('users', {
    cascade: true,
  });
  pgm.dropTable('roles_permissions', {
    cascade: true,
  });
  pgm.dropTable('permissions', {
    cascade: true,
  });
  pgm.dropTable('roles', {
    cascade: true,
  });
}
