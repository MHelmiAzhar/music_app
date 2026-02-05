import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import InvariantError from '../exceptions/InvariantError.js';

const uploadsDir = path.resolve(process.cwd(), 'uploads', 'covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${nanoid(16)}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new InvariantError('Tipe file harus berupa gambar'));
  }
  return cb(null, true);
};

const uploadCover = multer({
  storage,
  fileFilter,
  limits: { fileSize: 512000 },
}).single('cover');

export default uploadCover;
