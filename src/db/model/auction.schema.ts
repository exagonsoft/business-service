/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Auction extends Document {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0 })
  auctioneerId: string;

  @Prop({ default: [] })
  vehicles: string[];

  @Prop({default: true})
  active: boolean;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
