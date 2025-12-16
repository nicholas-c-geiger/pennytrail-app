declare module 'jsonwebtoken' {
  export type Secret = string | Buffer;

  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    [key: string]: unknown;
  }

  export function sign(
    payload: string | Buffer | object,
    secret: Secret,
    options?: SignOptions,
  ): string;
  export function decode(token: string): unknown;
  export function verify(token: string, secret: Secret): unknown;
}
