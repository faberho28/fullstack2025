import { Controller, Get, Param } from '@nestjs/common';
import { CheckBookAvailabilityUseCase } from '../../application/use-cases/CheckBookAvailabilityUseCase';

@Controller('books')
export class BooksController {
  constructor(private readonly checkBookAvailabilityUseCase: CheckBookAvailabilityUseCase) {}

  @Get(':id/availability')
  async checkAvailability(@Param('id') id: string) {
    return await this.checkBookAvailabilityUseCase.execute(id);
  }
}
