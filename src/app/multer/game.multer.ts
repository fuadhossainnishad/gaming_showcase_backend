import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';

const gameStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log('Game Multer - Request Details:', {
      userId: req.body.userId,
      user: req.user,
      body: req.body,
      file: file.originalname,
    });

    const userId = req.body.userId;
    if (!userId) {
      console.error('Game Multer - Error: userId is missing');
      return cb(
        new AppError(
          httpStatus.BAD_REQUEST,
          'userId is required for file upload',
          '',
        ),
        '',
      );
    }

    const uploadDir = path.join(process.cwd(), `src/uploads/${userId}/games`);
    console.log('Game Multer - Current Working Directory:', process.cwd());
    console.log('Game Multer - Target Upload Directory:', uploadDir);

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(
        'Game Multer - Directory created or already exists:',
        uploadDir,
      );
      cb(null, uploadDir);
    } catch (error: any) {
      console.error(
        'Game Multer - Directory creation failed:',
        error.message,
        error.stack,
      );
      cb(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Failed to create game upload directory: ${error.message}`,
          '',
        ),
        '',
      );
    }
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Game Multer - Generated filename:', filename);
    cb(null, filename);
  },
});

export const uploadGames = multer({
  storage: gameStorage,
  // fileFilter(req, file, cb: multer.FileFilterCallback) {
  //   const fileTypes = /jpeg|jpg|png|mp4|mov/;
  //   const fileExt = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //   const fileMimeType = fileTypes.test(file.mimetype);
  //   if (fileExt && fileMimeType) {
  //     console.log('Game Multer - File type accepted:', file.originalname);
  //     cb(null, true);
  //   } else {
  //     console.error('Game Multer - Invalid file type:', file.originalname);
  //     cb(new AppError(httpStatus.BAD_REQUEST, 'Only JPEG, JPG, PNG, MP4, or MOV files are allowed', '') as any, false);
  //   }
  // },
  // limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
