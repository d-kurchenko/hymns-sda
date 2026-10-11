import { LOCALE } from 'src/i18n/constants';
import { DEFAULT_FONT_SIZE, MAX_FONT_SIZE, MIN_FONT_SIZE } from 'src/modules/book/model/constants';
import { COLOR_SCHEME } from 'src/modules/theme/model/constants';
import { z } from 'zod';

export const settingsSchema = z.object({
  colorScheme: z.enum(COLOR_SCHEME).default(COLOR_SCHEME.SYSTEM),
  fontSize: z.number().int().min(MIN_FONT_SIZE).max(MAX_FONT_SIZE).default(DEFAULT_FONT_SIZE),
  locale: z.enum(LOCALE).default(LOCALE.SYSTEM),
});

export type Settings = z.infer<typeof settingsSchema>;
export const defaultSettings: Readonly<Settings> = Object.freeze(settingsSchema.parse({}));

// Recover individual fields so one invalid preference doesn't discard the others.
export function recoverSettings(value: unknown): Settings {
  const input = z.record(z.string(), z.unknown()).catch({}).parse(value);
  const fields = Object.entries(settingsSchema.shape).map(([key, schema]) => {
    const result = schema.safeParse(input[key]);
    return [key, result.success ? result.data : defaultSettings[key as keyof Settings]];
  });

  return settingsSchema.parse(Object.fromEntries(fields));
}
