/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'varchar(70)',
      primaryKey: true,
    },
    playlistId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlist_songs_playlist_id_fkey',
      onDelete: 'CASCADE',
    },
    songId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'playlist_songs_song_id_fkey',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('playlist_songs', 'unique_playlist_song', {
    unique: ['playlistId', 'songId'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
