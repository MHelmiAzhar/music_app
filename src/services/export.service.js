import { verifyOwner } from './playlist.service.js';
import { publishMessage } from './producer.service.js';

const EXPORT_PLAYLIST_QUEUE = 'export:playlists';

export const exportPlaylist = async ({ playlistId, targetEmail, userId }) => {
  await verifyOwner(playlistId, userId);
  await publishMessage(EXPORT_PLAYLIST_QUEUE, { playlistId, targetEmail });
};

export { EXPORT_PLAYLIST_QUEUE };
