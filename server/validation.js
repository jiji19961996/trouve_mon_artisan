import { z } from 'zod';
const line = (min,max) => z.string().trim().min(min).max(max).refine(s=> !/[\r\n\x00]/.test(s),'Une seule ligne est attendue.');
export const idSchema=z.coerce.number().int().positive().max(2147483647);
export const querySchema=z.object({category:idSchema.optional(),q:z.string().trim().max(100).optional(),featured:z.enum(['true']).optional(),page:z.coerce.number().int().min(1).max(10000).default(1)}).strict();
export const contactSchema=z.object({name:line(2,100),email:z.email().max(254),subject:line(3,150),message:z.string().trim().min(10).max(5000),website:z.string().max(0).optional()}).strict();
export function publicArtisan(a){const {email,...rest}=a;return rest;}
export function validKey(value, expected){return typeof value==='string' && Buffer.byteLength(value)===Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(value),Buffer.from(expected));}
import { timingSafeEqual } from 'node:crypto';
