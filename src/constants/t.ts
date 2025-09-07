import { z } from 'zod';

export const WalletSchema = z.object({
  id: z.string().min(1).max(11).default(''), // char(11) -> 字符串，长度上限 11
  unionpay: z.string().nullable().optional().default(''),
  wechat: z.string().nullable().optional().default(''), // 你原始 SQL 写了 `read` 我改成 real
  alipay: z.string().nullable().optional().default(''),
  eastmoney: z.string().nullable().optional().default(''),
  cash: z.string().nullable().optional().default(''),
  fund: z.array(z.string()).default([]),
  carpool: z.array(z.string()).default([]),
  // 时间戳 - 默认 CURRENT_TIMESTAMP，接收 string 或 Date 并转成 Date
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

// 方法枚举
const MethodEnum = z.enum(['GET', 'POST', 'DELETE', 'PUT']);

// 定义 schema，所有字段都有默认值
export const ApiEndpointSchema = z.object({
  id: z.string().default(''), // 默认空字符串
  introduce: z.string().default(''),
  host: z.string().default(''),
  path: z.string().default(''),
  method: MethodEnum.default('GET'),
  request: z.string().default('{}'),
  response: z.string().default('{}'),
  curl: z.string().default(''),
  remarks: z
    .array(
      z.object({
        key: z.string().default(''),
        value: z.string().default('')
      })
    )
    .default([]),
  created_at: z.string().default(() => new Date().toISOString()), // 默认当前时间
  updated_at: z.string().default(() => new Date().toISOString())
});

// 类型推导
export type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;
export type Wallet = z.infer<typeof WalletSchema>;

