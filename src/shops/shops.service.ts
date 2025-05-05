import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/sequelize';
//   import { Shop } from './models/shop.model';
// import {Shop}
import { Shop } from './models/shop.model';
  import { 
    RegisterShopDto, 
    ShopLoginDto, 
    UpdateShopDto,
    SearchShopDto,
  } from './dto/shop.dto';
  import { GlobalUploadService } from '../common/upload/global-upload.service';
  import { Request } from 'express';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import * as bcrypt from 'bcrypt';
  import { Op } from 'sequelize';
  
  @Injectable()
  export class ShopsService {
    constructor(
      @InjectModel(Shop)
      private readonly shopModel: typeof Shop,
      private readonly globalUploadService: GlobalUploadService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
    /**
     * Register a new shop
     */
    async register(registerShopDto: RegisterShopDto): Promise<Shop> {
      // Check if username already exists
      const existingUsername = await this.shopModel.findOne({
        where: { username: registerShopDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username already in use');
      }
  
      // Check if GSTIN number already exists
      const existingGstin = await this.shopModel.findOne({
        where: { gstinNumber: registerShopDto.gstinNumber },
      });
      if (existingGstin) {
        throw new ConflictException('GSTIN number already registered');
      }
  
      // Check if phone number already exists
      const existingPhone = await this.shopModel.findOne({
        where: { phoneNumber: registerShopDto.phoneNumber },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already in use');
      }
  
      // Validate password match
      if (registerShopDto.password !== registerShopDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(registerShopDto.password, 10);
  
      // Create shop with hashed password
      const { confirmPassword, ...shopData } = registerShopDto;
      const shop = await this.shopModel.create({
        ...shopData,
        password: hashedPassword,
      });
  
      // Return shop without sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Login shop
     */
    async login(loginDto: ShopLoginDto): Promise<{ shop: any; access_token: string }> {
      const shop = await this.shopModel.findOne({
        where: { username: loginDto.username },
      });
  
      if (!shop) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        shop.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Generate JWT token
      const payload = { username: shop.username, sub: shop.id, type: 'shop' };
      const accessToken = this.jwtService.sign(payload);
  
      // Update shop with new access token
      await shop.update({ access_token: accessToken });
  
      // Return shop without sensitive data
      const { password, ...result } = shop.get({ plain: true });
  
      return {
        shop: result,
        access_token: accessToken,
      };
    }
  
    /**
     * Find all shops with optional filters
     */
    async findAll(searchDto?: SearchShopDto): Promise<Shop[]> {
      const whereClause: any = {
        isActive: true,
        isVerified: true,
      };
  
      // Apply filters if provided
      if (searchDto) {
        if (searchDto.zone) {
          whereClause.zone = searchDto.zone;
        }
  
        if (searchDto.service) {
          whereClause.servicesOffered = {
            [Op.contains]: [searchDto.service],
          };
        }
  
        if (searchDto.searchTerm) {
          whereClause[Op.or] = [
            {
              storeName: {
                [Op.iLike]: `%${searchDto.searchTerm}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${searchDto.searchTerm}%`,
              },
            },
          ];
        }
      }
  
      const shops = await this.shopModel.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });
  
      // Remove sensitive data
      return shops.map(shop => {
        const { password, access_token, ...result } = shop.get({ plain: true });
        return result as any;
      });
    }
  
    /**
     * Find all shops by zone
     */
    async findByZone(zone: string): Promise<Shop[]> {
      const shops = await this.shopModel.findAll({
        where: { 
          zone,
          isActive: true,
          isVerified: true, 
        },
        order: [['createdAt', 'DESC']],
      });
  
      // Remove sensitive data
      return shops.map(shop => {
        const { password, access_token, ...result } = shop.get({ plain: true });
        return result as any;
      });
    }
  
    /**
     * Find a shop by ID
     */
    async findOne(id: number): Promise<Shop> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
  
      // Remove sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Update shop profile
     */
    async update(id: number, updateShopDto: UpdateShopDto): Promise<Shop> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
  
      // Check if phone number is unique if it's being updated
      if (updateShopDto.phoneNumber && updateShopDto.phoneNumber !== shop.phoneNumber) {
        const existingPhone = await this.shopModel.findOne({
          where: { 
            phoneNumber: updateShopDto.phoneNumber,
            id: { [Op.ne]: id },
          },
        });
        if (existingPhone) {
          throw new ConflictException('Phone number already in use');
        }
      }
  
      // Update shop data
      await shop.update(updateShopDto);
      
      // Return updated shop without sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Update shop profile image
     */
    async updateProfileImage(id: number, file: Express.Multer.File, req: Request): Promise<Shop> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
      
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      
      const fileUrl = this.globalUploadService.processFile(file, req);
      
      await shop.update({
        profileImage: fileUrl,
      });
      
      // Return updated shop without sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Verify a shop (admin only)
     */
    async verifyShop(id: number): Promise<Shop> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
      
      await shop.update({ isVerified: true });
      
      // Return updated shop without sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Deactivate a shop
     */
    async deactivate(id: number): Promise<Shop> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
      
      await shop.update({ isActive: false });
      
      // Return updated shop without sensitive data
      const { password, access_token, ...result } = shop.get({ plain: true });
      return result as any;
    }
  
    /**
     * Delete a shop (admin only)
     */
    async remove(id: number): Promise<void> {
      const shop = await this.shopModel.findByPk(id);
      
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
      
      await shop.destroy();
    }
  }