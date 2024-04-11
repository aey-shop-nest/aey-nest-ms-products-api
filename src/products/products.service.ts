import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll({ page, limit }: PaginationDto) {
    const records = await this.product.count();
    const lastPage = Math.ceil(records / limit);
    return {
      meta: {
        total: records,
        currentPage: page,
        lastPage,
      },
      products: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Resource not found`);
    }
    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...rest } = updateProductDto;
    if (!updateProductDto.name && !updateProductDto.price) {
      throw new BadRequestException(
        `You cannot update a resource without data`,
      );
    }
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: rest,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.delete({
      where: { id },
    });
  }

  async softDelete(id: number) {
    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: { available: false },
    });
    return product;
  }
}
