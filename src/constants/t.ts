import { z } from 'zod';

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
