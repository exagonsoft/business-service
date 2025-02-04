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
  Patch,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAuction(
    @Body()
    body: {
      startDate: Date;
      endDate: Date;
      auctioneerId: string;
      vehicles: string[];
    },
  ) {
    return this.auctionService.createAuction(
      body.startDate,
      body.endDate,
      body.auctioneerId,
      body.vehicles,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAuction(
    @Param('id') id: string,
    @Body()
    body: {
      startDate: Date;
      endDate: Date;
      auctioneerId: string;
      vehicles: string[];
    },
    @Request() req,
  ) {
    return this.auctionService.updateAuction(
      req.user,
      id,
      body.startDate,
      body.endDate,
      body.auctioneerId,
      body.vehicles,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuctions(@Request() req) {
    return this.auctionService.getAuctions(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAuctionDetails(@Param('id') id: string, @Request() req) {
    return this.auctionService.getAuctionDetails(req.user, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAuction(@Param('id') id: string, @Request() req) {
    return this.auctionService.deleteAuction(req.user, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patchAuction(
    @Param('id') id: string,
    @Body()
    body: {
      vehicleId: string;
      operation: 'add' | 'remove';
    },
    @Request() req,
  ) {
    return this.auctionService.updateAuctionVehicles(req.user, id, body.vehicleId, body.operation );
  }
}
