/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // TODO: Define type
    pgm.addColumn('movements', {
      type: {
        type: 'any',
        notNull: true,
      },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('movements', 'type', {
      cascade: true,
    });
}
