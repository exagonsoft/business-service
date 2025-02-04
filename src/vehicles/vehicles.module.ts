/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { JwtStrategy } from 'src/middlewares/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle } from 'src/db/model/vehicle.schema';
import { VehicleSchema } from 'src/db/model/vehicle.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [VehiclesService, JwtStrategy],
  controllers: [VehiclesController]
})
export class VehiclesModule {}
