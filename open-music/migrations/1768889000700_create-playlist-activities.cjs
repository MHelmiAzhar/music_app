/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_activities', {
    id: {
      type: 'varchar(70)',
      primaryKey: true,
    },
    playlistId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlist_activities_playlist_id_fkey',
      onDelete: 'CASCADE',
    },
    songId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'playlist_activities_song_id_fkey',
      onDelete: 'CASCADE',
    },
    userId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'playlist_activities_user_id_fkey',
      onDelete: 'CASCADE',
    },
    action: {
      type: 'varchar(10)',
      notNull: true,
    },
    time: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_activities');
};
