import { exportPlaylist as exportPlaylistService } from '../services/export.service.js';

export const exportPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.validatedParams ?? req.params;
    const { targetEmail } = req.body;
    const userId = req.auth.id;

    await exportPlaylistService({ playlistId, targetEmail, userId });

    res.status(201).json({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
  } catch (err) {
    next(err);
  }
};
