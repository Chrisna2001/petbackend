import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pet } from './models/pet.model';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { GlobalUploadService } from '../common/upload/global-upload.service';
import { Request } from 'express';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet)
    private readonly petModel: typeof Pet,
    private readonly globalUploadService: GlobalUploadService,
  ) {}

  /**
   * Create a new pet for a user
   */
  async create(userId: number, createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petModel.create({
      ...createPetDto,
      userId,
    });
  }

  /**
   * Find all pets for a user
   */
  async findAllByUser(userId: number): Promise<Pet[]> {
    return await this.petModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find a single pet by ID
   */
  async findOne(id: number): Promise<Pet> {
    const pet = await this.petModel.findByPk(id);
    
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    
    return pet;
  }

  /**
   * Check if a pet belongs to a user
   */
  async checkOwnership(petId: number, userId: number): Promise<Pet> {
    const pet = await this.findOne(petId);
    
    if (pet.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this pet');
    }
    
    return pet;
  }

  /**
   * Update a pet's information
   */
  async update(id: number, userId: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.checkOwnership(id, userId);
    
    await pet.update(updatePetDto);
    
    return pet;
  }

  /**
   * Update a pet's image
   */
  async updatePetImage(id: number, userId: number, file: Express.Multer.File, req: Request): Promise<Pet> {
    const pet = await this.checkOwnership(id, userId);
    
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    
    const fileUrl = this.globalUploadService.processFile(file, req);
    
    await pet.update({
      imageUrl: fileUrl,
    });
    
    return pet;
  }

  /**
   * Delete a pet
   */
  async remove(id: number, userId: number): Promise<void> {
    const pet = await this.checkOwnership(id, userId);
    
    await pet.destroy();
  }
}