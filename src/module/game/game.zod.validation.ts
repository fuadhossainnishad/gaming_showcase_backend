import { z } from 'zod';

export const GAME_CATEGORIES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Puzzle',
  'Sports',
  'Racing',
  'Shooter',
  'Other',
] as const;

const gameUploadValidationSchema = z.object({
  body: z.object({
    game_title: z
      .string({ required_error: 'Game title is required' })
      .min(1, 'Game title is required'),
    category: z.enum(GAME_CATEGORIES as [string, ...string[]], {
      required_error: 'Category is required',
      invalid_type_error: `Category must be one of: ${GAME_CATEGORIES.join(', ')}`,
    }),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, 'Description is required'),
    steam_link: z
      .string({ required_error: 'Steam link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    x_link: z
      .string({ required_error: 'X link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    linkedin_link: z
      .string({ required_error: 'LinkedIn link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    reddit_link: z
      .string({ required_error: 'Reddit link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    instagram_link: z
      .string({ required_error: 'Instagram link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    media_files: z
      .array(z.string(), { required_error: 'Media files are optional' })
      .optional(),
  }),
});

const gameUpdateValidationSchema = z.object({
  body: z.object({
    game_title: z
      .string({ required_error: 'Game title is required' })
      .min(1, 'Game title is required')
      .optional(),
    category: z
      .enum(GAME_CATEGORIES as [string, ...string[]], {
        required_error: 'Category is required',
        invalid_type_error: `Category must be one of: ${GAME_CATEGORIES.join(', ')}`,
      })
      .optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, 'Description is required')
      .optional(),
    steam_link: z
      .string({ required_error: 'Steam link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    x_link: z
      .string({ required_error: 'X link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    linkedin_link: z
      .string({ required_error: 'LinkedIn link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    reddit_link: z
      .string({ required_error: 'Reddit link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    instagram_link: z
      .string({ required_error: 'Instagram link is optional' })
      .url('Invalid URL format')
      .optional()
      .or(z.literal('')),
    media_files: z
      .array(z.string(), { required_error: 'Media files are optional' })
      .optional(),
  }),
});

export const GameValidation = {
  gameUploadValidationSchema,
  gameUpdateValidationSchema,
};
