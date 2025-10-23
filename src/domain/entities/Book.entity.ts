import { ISBN } from '../value-objects/ISBN.vo';

export class Book {
  constructor(
    public readonly id: string,
    public readonly isbn: ISBN,
    public readonly title: string,
    public readonly author: string,
    public readonly publicationYear: number,
    public readonly category: string,
    private availableCopies: number,
    public readonly totalCopies: number,
  ) {
    this.validateBook();
  }

  private validateBook(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Book title cannot be empty');
    }

    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Book author cannot be empty');
    }

    if (this.publicationYear < 1000 || this.publicationYear > new Date().getFullYear()) {
      throw new Error('Invalid publication year');
    }

    if (this.totalCopies < 0) {
      throw new Error('Total copies cannot be negative');
    }

    if (this.availableCopies < 0) {
      throw new Error('Available copies cannot be negative');
    }

    if (this.availableCopies > this.totalCopies) {
      throw new Error('Available copies cannot exceed total copies');
    }
  }

  public getAvailableCopies(): number {
    return this.availableCopies;
  }

  public hasAvailableCopies(): boolean {
    return this.availableCopies > 0;
  }

  public decreaseAvailableCopies(): void {
    if (this.availableCopies <= 0) {
      throw new Error('No available copies to loan');
    }
    this.availableCopies--;
  }

  public increaseAvailableCopies(): void {
    if (this.availableCopies >= this.totalCopies) {
      throw new Error('Cannot increase available copies beyond total copies');
    }
    this.availableCopies++;
  }

  public setAvailableCopies(copies: number): void {
    if (copies < 0 || copies > this.totalCopies) {
      throw new Error('Invalid available copies count');
    }
    this.availableCopies = copies;
  }

  public update(
    data: Partial<{
      isbn: string;
      title: string;
      author: string;
      publicationYear: number;
      category: string;
      availableCopies: number;
      totalCopies: number;
    }>,
  ): Book {
    return new Book(
      this.id,
      data?.isbn ? ISBN.create(data?.isbn) : this.isbn,
      data.title ?? this.title,
      data.author ?? this.author,
      data.publicationYear ?? this.publicationYear,
      data.category ?? this.category,
      data.availableCopies ?? this.availableCopies,
      data.totalCopies ?? this.totalCopies,
    );
  }
}
