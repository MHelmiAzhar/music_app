/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('collaborators', {
    id: {
      type: 'varchar(70)',
      primaryKey: true,
    },
    playlistId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'collaborators_playlist_id_fkey',
      onDelete: 'CASCADE',
    },
    userId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'collaborators_user_id_fkey',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('collaborators', 'unique_playlist_collaborator', {
    unique: ['playlistId', 'userId'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborators');
};
