import multer from 'multer';
import path from 'path';

const adminStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), `src/uploads/admin/heroImages/`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

export const uploadGames = multer({ storage: adminStorage });
