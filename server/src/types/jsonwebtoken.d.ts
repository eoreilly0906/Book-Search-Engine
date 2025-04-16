declare module 'jsonwebtoken' {
  export interface VerifyErrors {
    name: string;
    message: string;
    expireAt?: Date;
  }

  export function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: SignOptions): string;
  export function verify(token: string, secretOrPublicKey: string, options?: VerifyOptions, callback?: (err: VerifyErrors | null, decoded: any) => void): any;
  export function verify(token: string, secretOrPublicKey: string, callback?: (err: VerifyErrors | null, decoded: any) => void): any;
} 