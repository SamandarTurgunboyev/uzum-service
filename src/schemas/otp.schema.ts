
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema()
export class Otp {
    @Prop()
    phone: string;

    @Prop()
    otp: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });