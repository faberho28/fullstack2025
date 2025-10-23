import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserType } from '../../domain/entities/UserType.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Sam Doe',
    description: 'This is the name for the user',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'sam@example.com',
    description: 'Email of the user.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: UserType.TEACHER,
    description: 'Type of the user.',
    enum: UserType,
  })
  @IsEnum(UserType)
  type!: UserType;
}
