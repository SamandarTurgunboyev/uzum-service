
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    phone: string;

    @Prop()
    password: string;

    @Prop({ default: false })
    isVerified: boolean

    @Prop({ default: Role.User })
    roles: string
}

export const UserSchema = SchemaFactory.createForClass(User);