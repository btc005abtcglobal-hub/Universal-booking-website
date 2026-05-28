import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post(':merchantId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service for a merchant' })
  async create(
    @Param('merchantId') merchantId: string,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(merchantId, dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List/search services' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiQuery({ name: 'merchantId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'isFeatured', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'latitude', required: false })
  @ApiQuery({ name: 'longitude', required: false })
  @ApiQuery({ name: 'radius', required: false })
  async findAll(
    @Query() query: GetServicesFilterDto,
  ) {
    return this.servicesService.findAll(query, query);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all service categories' })
  async getCategories() {
    return this.servicesService.getCategories();
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured services' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.servicesService.getFeatured(limit);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get service by ID' })
  async findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service' })
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete service' })
  async delete(@Param('id') id: string) {
    return this.servicesService.softDelete(id);
  }
}
