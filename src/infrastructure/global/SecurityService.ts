import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { SecurityServices } from '@/domain/global/SegurityService';
import { environmentService } from './EnvironmentService';

export class SecurityService implements SecurityServices {
  private readonly SECRETKEY;

  constructor() {
    this.SECRETKEY = environmentService.get().JWT_SECRET;
  }
  async hash(value: string): Promise<string> {
    const newValue = await bcrypt.hash(value, 10);
    return newValue;
  }
  async comparepassword(plainPw: string, hashPw2: string): Promise<boolean> {
    return await bcrypt.compare(plainPw, hashPw2);
  }
  generateJwt(userId: number): string {
    const token = Jwt.sign({ userId: userId }, this.SECRETKEY);
    return token;
  }
  verifyjwt(token: string): { iat: number; userId: number } | null {
    try {
      const decodedToekn = Jwt.verify(token, this.SECRETKEY);
      return decodedToekn as { iat: number; userId: number };
    } catch {
      return null;
    }
  }
}
