import { IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsNumber()
  receiverId: number;
} 