/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';
import { VehicleMedia } from 'src/db/model/vehicle.schema';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createVehicle(
    @Body()
    body: {
      title: string;
      description: string;
      country: string;
      price: number;
      media: VehicleMedia[];
    },
    @Request() req,
  ) {
    return this.vehicleService.createVehicle(
      body.title,
      body.description,
      body.country,
      body.price,
      body.media,
      req.user.userId,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateVehicle(
    @Param('id') id: string,
    @Body()
    body: {
      title: string;
      description: string;
      country: string;
      price: number;
      media: VehicleMedia[];
    },
    @Request() req,
  ) {
    return this.vehicleService.updateVehicle(
      req.user,
      id,
      body.title,
      body.description,
      body.country,
      body.price,
      body.media,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getVehicles(@Request() req) {
    return this.vehicleService.getVehicles(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getVehicleDetails(@Param('id') id: string, @Request() req) {
    return this.vehicleService.getVehicleDetails(req.user, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteVehicle(@Param('id') id: string, @Request() req) {
    return this.vehicleService.deleteVehicle(req.user, id);
  }
}
