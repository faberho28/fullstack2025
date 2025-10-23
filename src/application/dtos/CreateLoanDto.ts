import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'Unique identifier of the book to be loaned.',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  bookId!: string;

  @ApiProperty({
    example: 'f1e2d3c4-5678-90ab-cdef-0987654321fe',
    description: 'Unique identifier of the user borrowing the book.',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId!: string;
}
