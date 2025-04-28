import multer from 'multer';
import path from 'path';

const profileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.body.userId || req.body._id;
    const uploadDir = path.join(process.cwd(), `src/${userId}/profile/`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

export const uploadProfile = multer({ storage: profileStorage });
