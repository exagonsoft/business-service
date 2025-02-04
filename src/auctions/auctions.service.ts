/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from 'src/db/model/auction.schema';
import { Vehicle } from 'src/db/model/vehicle.schema';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async createAuction(
    startDate: Date,
    endDate: Date,
    auctioneerId: string,
    vehicles: string[],
  ) {
    try {
      const auction = new this.auctionModel({
        startDate,
        endDate,
        auctioneerId,
        vehicles,
      });
      return auction.save();
    } catch (error) {
      console.error('Error Creating Auction: ', error);
      throw new InternalServerErrorException('Server Error Creating auction');
    }
  }

  async updateAuction(
    user: { userId: string; role: string },
    _id: string,
    startDate: Date,
    endDate: Date,
    auctioneerId: string,
    vehicles: string[],
  ) {
    try {
      const _auction = await this.auctionModel.findById(_id).exec();

      if (!_auction) {
        throw new NotFoundException('Auction not found');
      }

      // Allow updates only if user is an admin or the owner
      if (user.role !== 'admin') {
        throw new UnauthorizedException(
          'Only an administrator can update Auctions',
        );
      }

      // Update fields if provided
      _auction.startDate = startDate ?? _auction.startDate;
      _auction.endDate = endDate ?? _auction.endDate;
      _auction.auctioneerId = auctioneerId ?? _auction.auctioneerId;
      _auction.vehicles = vehicles ?? _auction.vehicles;

      // Save the updated vehicle
      await _auction.save();

      return _auction; // Return the updated vehicle
    } catch (error) {
      console.error('Error Updating Vehicle:', error);
      throw new InternalServerErrorException('Server Error Updating vehicle');
    }
  }

  async updateAuctionVehicles(
    user: { userId: string; role: string },
    _id: string,
    vehicleId: string,
    operation: 'add' | 'remove',
  ) {
    try {
      const _auction = await this.auctionModel.findById(_id).exec();

      if (!_auction) {
        throw new NotFoundException('Auction not found');
      }

      // Allow updates only if user is an admin or the owner
      if (user.role !== 'admin') {
        throw new UnauthorizedException(
          'Only an administrator can update Auctions',
        );
      }

      switch (operation) {
        case 'add':
          if (!_auction.vehicles.includes(vehicleId)) {
            _auction.vehicles.push(vehicleId);
          }
          break;

        case 'remove':
          _auction.vehicles = _auction.vehicles.filter(
            (vehicle) => vehicle !== vehicleId, // ✅ Properly removes the vehicle
          );
          break;

        default:
          throw new Error('Invalid operation type'); // ✅ Handle unknown operations
      }

      // Save the updated vehicle
      await _auction.save();

      return _auction; // Return the updated vehicle
    } catch (error) {
      console.error('Error Updating Vehicle:', error);
      throw new InternalServerErrorException('Server Error Updating vehicle');
    }
  }

  async getAuctions(user: { userId: string; role: string }) {
    try {
      if (user.role === 'admin') {
        return this.auctionModel.find().exec();
      } else {
        return this.auctionModel.find({ active: true }).exec();
      }
    } catch (error) {
      console.error('Error Fetching Auctions: ', error);
      throw new InternalServerErrorException('Server Error Fetching Auctions');
    }
  }

  async getAuctionDetails(user: { userId: string; role: string }, id: string) {
    try {
      const _auction = await this.auctionModel.findById(id).exec();

      if (!_auction) {
        throw new NotFoundException('Auction not found');
      }

      // Use Promise.all to resolve all vehicle lookups concurrently
      const _auctionVehicles = await Promise.all(
        _auction.vehicles.map((vehicleId) =>
          this.vehicleModel.findById(vehicleId).exec(),
        ),
      );

      const _resultAuction = {
        _id: _auction._id,
        startDate: _auction.startDate,
        auctioneerId: _auction.auctioneerId,
        vehicles: _auctionVehicles, // Now contains resolved vehicle data
        active: _auction.active,
      };

      return _resultAuction;
    } catch (error) {
      console.error('Error Fetching Auction Details: ', error);
      throw new InternalServerErrorException(
        'Server Error Fetching Auction Details',
      );
    }
  }

  async deleteAuction(user: { userId: string; role: string }, id: string) {
    try {
      if (user.role !== 'admin') {
        throw new UnauthorizedException(
          'Only an Administrator are allowed to delete auctions',
        );
      }
      return this.auctionModel.deleteOne({ _id: id }).exec();
    } catch (error) {
      console.error('Error Fetching Auction: ', error);
      throw new InternalServerErrorException('Server Error Fetching Auction');
    }
  }
}
