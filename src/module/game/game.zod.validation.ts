import { z } from 'zod';
import { gameCategory } from './game.constant';

const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const GameSchema = z.object({
  body: z.object({
    game_title: z
      .string()
      .min(1, { message: 'Game title is required' })
      .max(100, { message: 'Game title cannot exceed 100 characters' }),

    category: z.enum(gameCategory as [string, ...string[]], {
      message: `Category must be one of: ${gameCategory.join(', ')}`,
    }),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .max(2000, { message: 'Description cannot exceed 2000 characters' }),

    steam_link: z
      .string()
      .url({ message: 'Must be a valid Steam URL' })
      .regex(urlPattern, { message: 'Invalid Steam URL format' }),

    x_link: z
      .string()
      .url({ message: 'Must be a valid X URL' })
      .regex(urlPattern, { message: 'Invalid X URL format' }),

    linkedin_link: z
      .string()
      .url({ message: 'Must be a valid LinkedIn URL' })
      .regex(urlPattern, { message: 'Invalid LinkedIn URL format' }),

    reddit_link: z
      .string()
      .url({ message: 'Must be a valid Reddit URL' })
      .regex(urlPattern, { message: 'Invalid Reddit URL format' }),

    instagram_link: z
      .string()
      .url({ message: 'Must be a valid Instagram URL' })
      .regex(urlPattern, { message: 'Invalid Instagram URL format' }),

    media_files: z
      .array(z.string().url({ message: 'Each media file must be a valid URL' }))
      .min(1, { message: 'At least one media file is required' })
      .optional(),
  }),
});

const GameValidationSchema = {
  GameSchema,
};

export default GameValidationSchema;
