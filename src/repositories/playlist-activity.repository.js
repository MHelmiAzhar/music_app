import pool from '../utils/db.js';

export const insertPlaylistActivity = async ({
  id,
  playlistId,
  songId,
  userId,
  action,
}) => {
  await pool.query(
    'INSERT INTO playlist_activities(id, "playlistId", "songId", "userId", action) VALUES($1, $2, $3, $4, $5)',
    [id, playlistId, songId, userId, action]
  );
};

export const selectPlaylistActivities = async (playlistId) => {
  const result = await pool.query(
    `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time
     FROM playlist_activities
     LEFT JOIN users ON playlist_activities."userId" = users.id
     LEFT JOIN songs ON playlist_activities."songId" = songs.id
     WHERE playlist_activities."playlistId" = $1
     ORDER BY playlist_activities.time ASC`,
    [playlistId]
  );
  return result.rows;
};
