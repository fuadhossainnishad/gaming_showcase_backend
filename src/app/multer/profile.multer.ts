import multer from 'multer';
import path from 'path';

const profileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.body.userId || req.body._id;
    if (!userId) {
      return cb(new Error('userId or _id is required for file upload'), '');
    }
    const uploadDir = path.join(
      process.cwd(),
      `src/uploads/${userId}/profile/`,
    );
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter(req, file, cb: multer.FileFilterCallback) {
    const fileTypes = /jpeg | jpg | png/;
    const fileExt = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const fileMemeType = fileTypes.test(file.mimetype);

    if (fileExt && fileMemeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG/JPG/PNG images are allowed') as any, false);
    }
  },
  // limits:{}
});
