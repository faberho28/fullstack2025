import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class ReturnBookDto {
  @ApiProperty({
    example: 'b1c2d3e4-5678-90ab-cdef-1234567890ab',
    description: 'Unique identifier of the loan to be returned.',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  loanId!: string;

  @ApiPropertyOptional({
    example: '2025-10-21T14:30:00Z',
    description:
      'Date when the book was returned (ISO 8601 format). Optional, defaults to current date if not provided.',
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string; // ISO 8601 format
}
