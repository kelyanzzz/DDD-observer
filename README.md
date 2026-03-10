# DDD + Observer Pattern — Gym Membership Domain

A TypeScript implementation of Domain-Driven Design (DDD) and the Observer Pattern,
using a gym membership system as the domain.

## APP Structure
DDD-observer/
├── docs/
│   └── domain.md
├── src/
│   ├── domain/
│   │   ├── events/
│   │   │   └── events.ts
│   │   └── product/
│   │       ├── factories.ts
│   │       ├── member.ts
│   │       └── types.ts
│   └── infrastructure/
│       └── observers/
│           ├── database.ts
│           ├── emails.ts
│           └── observers.ts
├── index.ts
├── package.json
├── tsconfig.json
└── README.md