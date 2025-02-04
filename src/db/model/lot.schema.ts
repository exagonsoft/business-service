/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Lot extends Document {
  @Prop({ required: true })
  startPrice: number;

  @Prop({ default: [] })
  articles: string[];

  @Prop({default: true})
  active: boolean;
}

export const LotSchema = SchemaFactory.createForClass(Lot);
