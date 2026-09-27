export interface SecurityServices {
  hash(value: string): Promise<string>;
  comparepassword(pw1: string, pw2: string): Promise<boolean>;
  generateJwt(userId: number): string;
  verifyjwt(token: string): { iat: number; userId: number } | null;
}
