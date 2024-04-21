import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ lowercase: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: now() })
    createdDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);