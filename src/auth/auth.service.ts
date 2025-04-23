import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.model';
import { Profile } from '../profile/models/profile.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Profile)
    private readonly profileModel: typeof Profile,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    // First check if email already exists
    const existingEmail = await this.userModel.findOne({
      where: { email: registerDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // Check if username already exists
    const existingUsername = await this.userModel.findOne({
      where: { username: registerDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    // Check if phone number already exists
    const existingPhone = await this.userModel.findOne({
      where: { phoneNumber: registerDto.phoneNumber },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already in use');
    }

    // Validate password match
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Use transaction to ensure both user and profile are created
    const transaction = await this.sequelize.transaction();

    try {
      // Create user
      const user = await this.userModel.create(
        {
          email: registerDto.email,
          username: registerDto.username,
          name: registerDto.name,
          phoneNumber: registerDto.phoneNumber,
          password: hashedPassword,
          role: registerDto.role || 'user',
        },
        { transaction },
      );

      // Create an empty profile for the user
      await this.profileModel.create(
        {
          userId: user.id,
        },
        { transaction },
      );

      await transaction.commit();

      // Fetch the user with profile included
      const userWithProfile = await this.userModel.findByPk(user.id, {
        include: [Profile],
      });

      // Remove sensitive data
      const { password, access_token, ...result } = userWithProfile.get({
        plain: true,
      });

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: any; access_token: string }> {
    const user = await this.userModel.findOne({
      where: { username: loginDto.username },
      include: [Profile],
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

    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Update user with new access token
    await user.update({ access_token: accessToken });

    // Remove sensitive data
    const { password, access_token, ...result } = user.get({ plain: true });

    return {
      user: result,
      access_token: accessToken,
    };
  }
}