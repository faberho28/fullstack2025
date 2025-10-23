import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './CreateBookDto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
