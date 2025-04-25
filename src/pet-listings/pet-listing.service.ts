import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PetListing } from './models/pet-listing.model';
import { CreatePetListingDto, UpdatePetListingDto, SearchPetListingDto } from './dto/pet-listing.dto';
import { GlobalUploadService } from '../common/upload/global-upload.service';
import { Request } from 'express';
import { Op } from 'sequelize';
import { User } from '../user/models/user.model';

@Injectable()
export class PetListingsService {
  constructor(
    @InjectModel(PetListing)
    private readonly petListingModel: typeof PetListing,
    private readonly globalUploadService: GlobalUploadService,
  ) {}

  /**
   * Create a new pet listing
   */
  async create(userId: number, createPetListingDto: CreatePetListingDto): Promise<PetListing> {
    return await this.petListingModel.create({
      ...createPetListingDto,
      userId,
    });
  }

  /**
   * Find all pet listings with optional filters
   */
  async findAll(searchDto?: SearchPetListingDto): Promise<PetListing[]> {
    const whereClause: any = {
      isActive: true,
    };

    // Apply filters if provided
    if (searchDto) {
      if (searchDto.type) {
        whereClause.type = searchDto.type;
      }

      if (searchDto.breed) {
        whereClause.breed = {
          [Op.iLike]: `%${searchDto.breed}%`, // Case-insensitive partial match
        };
      }

      if (searchDto.sex) {
        whereClause.sex = searchDto.sex;
      }

      if (searchDto.minPrice !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [Op.gte]: searchDto.minPrice,
        };
      }

      if (searchDto.maxPrice !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [Op.lte]: searchDto.maxPrice,
        };
      }
    }

    return await this.petListingModel.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find all pet listings by a specific user
   */
  async findAllByUser(userId: number): Promise<PetListing[]> {
    return await this.petListingModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find a single pet listing by ID
   */
  async findOne(id: number): Promise<PetListing> {
    const petListing = await this.petListingModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username'],
        },
      ],
    });
    
    if (!petListing) {
      throw new NotFoundException(`Pet listing with ID ${id} not found`);
    }
    
    return petListing;
  }

  /**
   * Check if a pet listing belongs to a user
   */
  async checkOwnership(listingId: number, userId: number): Promise<PetListing> {
    const petListing = await this.findOne(listingId);
    
    if (petListing.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this listing');
    }
    
    return petListing;
  }

  /**
   * Update a pet listing's information
   */
  async update(id: number, userId: number, updatePetListingDto: UpdatePetListingDto): Promise<PetListing> {
    const petListing = await this.checkOwnership(id, userId);
    
    await petListing.update(updatePetListingDto);
    
    return petListing;
  }

  /**
   * Update a pet listing's image
   */
  async updatePetImage(id: number, userId: number, file: Express.Multer.File, req: Request): Promise<PetListing> {
    const petListing = await this.checkOwnership(id, userId);
    
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    
    const fileUrl = this.globalUploadService.processFile(file, req);
    
    await petListing.update({
      petImageUrl: fileUrl,
    });
    
    return petListing;
  }

  /**
   * Update a pet license image
   */
  async updateLicenseImage(id: number, userId: number, file: Express.Multer.File, req: Request): Promise<PetListing> {
    const petListing = await this.checkOwnership(id, userId);
    
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    
    const fileUrl = this.globalUploadService.processFile(file, req);
    
    await petListing.update({
      licenseImageUrl: fileUrl,
    });
    
    return petListing;
  }

  /**
   * Delete a pet listing
   */
  async remove(id: number, userId: number): Promise<void> {
    const petListing = await this.checkOwnership(id, userId);
    
    await petListing.destroy();
  }

  /**
   * Deactivate a pet listing (mark as sold or no longer available)
   */
  async deactivate(id: number, userId: number): Promise<PetListing> {
    const petListing = await this.checkOwnership(id, userId);
    
    await petListing.update({ isActive: false });
    
    return petListing;
  }
}