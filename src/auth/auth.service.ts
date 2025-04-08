// auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.userModel.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: registerDto.role,
    });
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Update user with new access token
    await user.update({ access_token: accessToken });

    return user;
  }

  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.userModel.findOne({ where: { email } });
  //   if (user && (await bcrypt.compare(pass, user.password))) {
  //     const { password, ...result } = user.get({ plain: true });
  //     return result;
  //   }
  //   return null;
  // }
}
