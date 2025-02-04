/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleMedia } from 'src/db/model/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async createVehicle(
    title: string,
    description: string,
    country: string,
    price: number,
    media: VehicleMedia[],
    userId: string,
  ) {
    try {
      const vehicle = new this.vehicleModel({
        title,
        description,
        country,
        price,
        media,
        userId,
      });
      return vehicle.save();
    } catch (error) {
      console.error('Error Creating Vehicle: ', error);
      throw new InternalServerErrorException('Server Error Creating vehicle');
    }
  }

  async updateVehicle(
    user: { userId: string; role: string },
    _id: string,
    title: string,
    description: string,
    country: string,
    price: number,
    media: VehicleMedia[],
  ) {
    try {
      const _vehicle = await this.vehicleModel.findById(_id).exec();

      if (!_vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      // Allow updates only if user is an admin or the owner
      if (user.role !== 'admin' && user.userId !== _vehicle.userId) {
        throw new UnauthorizedException(
          'Only the owner or an administrator can update vehicles',
        );
      }

      // Update fields if provided
      _vehicle.title = title ?? _vehicle.title;
      _vehicle.description = description ?? _vehicle.description;
      _vehicle.country = country ?? _vehicle.country;
      _vehicle.price = price ?? _vehicle.price;
      _vehicle.media = media.length > 0 ? media : _vehicle.media;

      // Save the updated vehicle
      await _vehicle.save();

      return _vehicle; // Return the updated vehicle
    } catch (error) {
      console.error('Error Updating Vehicle:', error);
      throw new InternalServerErrorException('Server Error Updating vehicle');
    }
  }

  async getVehicles(user: { userId: string; role: string }) {
    try {
      if (user.role === 'admin') {
        return this.vehicleModel.find({available: true}).exec();
      } else {
        return this.vehicleModel.find({ userId: user.userId, available: true }).exec();
      }
    } catch (error) {
      console.error('Error Fetching Vehicles: ', error);
      throw new InternalServerErrorException('Server Error Fetching vehicle');
    }
  }

  async getVehicleDetails(user: { userId: string; role: string }, id: string) {
    try {

      const _vehicle = await this.vehicleModel.findById({_id: id}).exec();

      if (user.role !== 'admin' && user.userId !== _vehicle.userId) {
        throw new UnauthorizedException(
          'Only the owner or an administrator can update vehicles',
        );
      }

      if (user.role === 'admin') {
        return this.vehicleModel.find({ _id: id }).exec();
      } else {
        return this.vehicleModel.find({ _id: id, userId: user.userId }).exec();
      }
    } catch (error) {
      console.error('Error Fetching Vehicles: ', error);
      throw new InternalServerErrorException('Server Error Fetching vehicle');
    }
  }

  async deleteVehicle(user: { userId: string; role: string }, id: string) {
    try {
      if (user.role === 'admin') {
        return this.vehicleModel.deleteOne({ id: id }).exec();
      } else {
        const _vehicle = this.vehicleModel
          .find({ id: id, userId: user.userId })
          .exec();
        if (!_vehicle) {
          throw new UnauthorizedException(
            'Only the owner or an Administrator are allowed to delete vehicles',
          );
        }
        return this.vehicleModel.deleteOne({ _id: id }).exec();
      }
    } catch (error) {
      console.error('Error Fetching Vehicles: ', error);
      throw new InternalServerErrorException('Server Error Fetching vehicle');
    }
  }
}
