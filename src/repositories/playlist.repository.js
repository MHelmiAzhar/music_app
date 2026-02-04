import pool from '../utils/db.js';

export const insertPlaylist = async ({ id, name, owner }) => {
  const result = await pool.query(
    'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
    [id, name, owner]
  );
  return result.rows[0];
};

export const selectPlaylistsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT playlists.id, playlists.name, users.username
     FROM playlists
     LEFT JOIN users ON playlists.owner = users.id
     WHERE playlists.owner = $1
        OR playlists.id IN (
          SELECT "playlistId" FROM collaborators WHERE "userId" = $1
        )
     ORDER BY playlists."createdAt" DESC`,
    [userId]
  );
  return result.rows;
};

export const selectPlaylistOwner = async (playlistId) => {
  const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlistId]);
  return result.rows[0] ?? null;
};

export const selectPlaylistById = async (playlistId) => {
  const result = await pool.query('SELECT id, name, owner FROM playlists WHERE id = $1', [playlistId]);
  return result.rows[0] ?? null;
};

export const selectPlaylistWithOwner = async (playlistId) => {
  const result = await pool.query(
    `SELECT playlists.id, playlists.name, users.username
     FROM playlists
     LEFT JOIN users ON playlists.owner = users.id
     WHERE playlists.id = $1`,
    [playlistId]
  );
  return result.rows[0] ?? null;
};

export const updatePlaylistById = async ({ id, name }) => {
  const result = await pool.query(
    'UPDATE playlists SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id',
    [name, id]
  );
  return result.rowCount;
};

export const deletePlaylistById = async (id) => {
  const result = await pool.query('DELETE FROM playlists WHERE id = $1', [id]);
  return result.rowCount;
};

export const selectPlaylistSongs = async (playlistId) => {
  const result = await pool.query(
    `SELECT songs.id, songs.title, songs.performer
     FROM playlist_songs
     LEFT JOIN songs ON playlist_songs."songId" = songs.id
     WHERE playlist_songs."playlistId" = $1
     ORDER BY playlist_songs."createdAt" DESC`,
    [playlistId]
  );
  return result.rows;
};

export const insertPlaylistSong = async ({ id, playlistId, songId }) => {
  await pool.query(
    'INSERT INTO playlist_songs(id, "playlistId", "songId") VALUES($1, $2, $3)',
    [id, playlistId, songId]
  );
};

export const deletePlaylistSong = async ({ playlistId, songId }) => {
  const result = await pool.query(
    'DELETE FROM playlist_songs WHERE "playlistId" = $1 AND "songId" = $2',
    [playlistId, songId]
  );
  return result.rowCount;
};
