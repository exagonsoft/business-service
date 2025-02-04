/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/middlewares/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { Auction, AuctionSchema } from 'src/db/model/auction.schema';
import { Vehicle, VehicleSchema } from 'src/db/model/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, JwtStrategy],
})
export class AuctionsModule {}
