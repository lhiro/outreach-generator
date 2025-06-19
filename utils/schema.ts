import { z } from 'zod'
import type { AnyPgTable } from 'drizzle-orm/pg-core'

const rawTypeToZod: Record<string, () => z.ZodTypeAny> = {
  varchar: () => z.string(),
  'character varying': () => z.string(),
  char: () => z.string(),
  text: () => z.string(),
  uuid: () => z.string().uuid(),
  integer: () => z.number().int(),
  int4: () => z.number().int(),
  bigint: () => z.bigint(),
  numeric: () => z.number(),
  boolean: () => z.boolean(),
  date: () => z.date(),
  timestamp: () => z.date(),
  timestamptz: () => z.date(),
  json: () => z.any(),
  jsonb: () => z.any()
}

export function toZod<
  T extends AnyPgTable,
  P extends readonly (keyof T['_']['columns'])[] = [],
  O extends readonly (keyof T['_']['columns'])[] = []
>(
  table: T,
  opts?: {
    pick?: P
    omit?: O
    overwrite?: Partial<Record<keyof T['_']['columns'], z.ZodTypeAny>>
  }
) {
  const columnSource: Record<string, any> =
    (table as any)?._?.columns ?? (table as any)
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const [key, col] of Object.entries(columnSource)) {
    if (!col || typeof col !== 'object') continue
    if (opts?.pick && !opts.pick.includes(key as any)) continue
    if (opts?.omit?.includes(key as any)) continue

    if (opts?.overwrite && key in opts.overwrite) {
      shape[key] = opts.overwrite[key as keyof typeof opts.overwrite]!
      continue
    }

    const sql = (col.getSQLType?.() || col.dataType || '').toLowerCase()
    const base = sql.replace(/\(.+\)/, '').trim()
    const zFactory = rawTypeToZod[base]
    if (!zFactory) continue

    shape[key] = col.notNull ? zFactory() : zFactory().nullable()
  }

  return z.object(shape)
}
