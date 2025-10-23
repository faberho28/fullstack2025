import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: '978-3-16-148410-0',
    description: 'Unique ISBN code that identifies the book.',
  })
  @IsString()
  isbn!: string;

  @ApiProperty({
    example: 'Clean Code',
    description: 'Title of the book.',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Robert C. Martin',
    description: 'Author of the book.',
  })
  @IsString()
  author!: string;

  @ApiProperty({
    example: 2008,
    description: 'Year when the book was published.',
  })
  @IsNumber()
  publicationYear!: number;

  @ApiProperty({
    example: 'Software Engineering',
    description: 'Category or genre of the book.',
  })
  @IsString()
  category!: string;

  @ApiProperty({
    example: 5,
    description: 'Number of copies currently available for borrowing.',
  })
  @IsNumber()
  availableCopies!: number;

  @ApiProperty({
    example: 10,
    description: 'Total number of copies owned by the library.',
  })
  @IsNumber()
  totalCopies!: number;
}
