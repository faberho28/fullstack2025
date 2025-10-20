# 📚 Digital Library Challenge - Backend TypeScript/Node.js

## 🎯 Overview

Welcome to the **Digital Library Challenge**! This is a technical assessment designed to evaluate your skills in TypeScript, Node.js, Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD).

Your mission is to **make all the RED tests turn GREEN** by implementing the missing business logic while maintaining clean code principles and architectural patterns.

## 🏗️ Architecture

This project follows **Clean Architecture** and **Domain-Driven Design** principles with 4 main layers:

```
src/
├── domain/              ✅ COMPLETE - Business entities and rules
├── application/         ⚠️  SKELETON - Use cases with TODO comments
├── infrastructure/      ⚠️  SKELETON - Repositories without implementation
└── presentation/        ✅ COMPLETE - Controllers and HTTP layer
```

## 📋 Business Domain

You'll be working with a **Digital Library Management System** with the following entities:

- **Book**: ISBN, title, author, available copies
- **User**: name, email, type (STUDENT/TEACHER/ADMIN)
- **Loan**: book, user, dates, status, fines

### Business Rules to Implement

1. ✅ Students can borrow maximum **3 books**
2. ✅ Teachers can borrow maximum **5 books**
3. ✅ Can't borrow if no copies available
4. ✅ Student loans expire after **14 days**
5. ✅ Teacher loans expire after **30 days**
6. ✅ Users with overdue loans cannot borrow more books
7. ✅ Late returns incur a fine of **$1.50 per day**

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn
- Git
- GitHub account

### Installation

1. **Fork this repository**

   Click the "Fork" button at the top right of this repository to create your own copy.

2. **Clone your fork**
   ```bash
   git clone git@github.com:YOUR_USERNAME/backend-developer.git
   cd backend-developer
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

5. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

6. **Run seed script** (optional - creates sample data)
   ```bash
   npm run seed
   ```

7. **Run tests to see current status**
   ```bash
   npm test
   ```

   You should see **24 tests FAILING** 🔴

## 🎯 Your Mission

### Step 1: Understand the Domain ✅

The domain layer is **fully implemented**. Study these files:
- `src/domain/entities/*` - Book, User, Loan entities
- `src/domain/value-objects/*` - ISBN, Email, LoanPeriod
- `src/domain/rules/*` - Business rules

### Step 2: Implement Use Cases ⚠️

Navigate to `src/application/use-cases/` and implement:
- `CreateLoanUseCase.ts` - Follow the TODO comments
- `ReturnBookUseCase.ts` - Follow the TODO comments
- `GetUserLoansUseCase.ts`
- `CheckBookAvailabilityUseCase.ts`

### Step 3: Implement Repositories ⚠️

Navigate to `src/infrastructure/repositories/` and implement:
- `BookRepository.ts` - Database operations for books
- `UserRepository.ts` - Database operations for users
- `LoanRepository.ts` - Database operations for loans

Use TypeORM to interact with the database entities in `src/infrastructure/database/entities/`

### Step 4: Make Tests Pass ✅

Run tests and fix implementation until all pass:
```bash
npm test
```

Expected final result: **24 tests PASSING** ✅

## 📊 Validation

When you're done, validate your solution:

```bash
npm run validate
```

This runs:
- ✅ Type checking
- ✅ Linting
- ✅ All tests
- ✅ Coverage check (80% minimum)

## 📤 Submission

Once you've completed the challenge:

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: implement digital library challenge"
   ```

2. **Push to your fork**
   ```bash
   git push origin main
   ```

3. **Submit your repository URL**

   Send us the link to your GitHub repository fork with your implementation.

**Important**: Make sure your repository is **public** or give us access so we can review your code.

## 📚 Available Commands

```bash
# Development
npm run start:dev          # Start dev server with hot reload

# Testing
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage

# Quality
npm run lint              # Check code style
npm run type-check        # TypeScript validation
npm run validate          # Run all checks

# Database
npm run seed              # Populate database with sample data
```

## 📖 Documentation

- [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) - Detailed step-by-step guide
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Architecture explanation
- [`HINTS.md`](./HINTS.md) - Optional hints (try without first!)

## 🎓 Evaluation Criteria

Your implementation will be evaluated on:

1. ✅ **All tests passing** (24/24)
2. 🏗️ **Clean Architecture** adherence
3. 🎯 **SOLID principles** application
4. 📝 **TypeScript** strict mode compliance
5. 🧪 **Test coverage** (80%+ required)
6. 🎨 **Code quality** and readability

## ⏱️ Time Estimate

- **Junior**: 8-12 hours
- **Middle**: 4-6 hours
- **Senior**: 2-3 hours

## 🆘 Need Help?

1. Read [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) for detailed guidance
2. Check [`ARCHITECTURE.md`](./ARCHITECTURE.md) to understand the structure
3. Review [`HINTS.md`](./HINTS.md) for implementation tips (optional)
4. Study the fully implemented domain layer

## 📝 License

MIT

---

**Good luck! 🚀 Show us your clean code skills!**
