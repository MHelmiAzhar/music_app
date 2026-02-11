/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'varchar(70)',
      primaryKey: true,
    },
    albumId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'albums',
      referencesConstraintName: 'album_likes_album_id_fkey',
      onDelete: 'CASCADE',
    },
    userId: {
      type: 'varchar(70)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'album_likes_user_id_fkey',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('album_likes', 'album_likes_unique_album_user', {
    unique: ['albumId', 'userId'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
