# CryptoTally - Documentation Index

## 📚 Documentation Structure

This project follows a **feature-based documentation strategy** where each feature has its own folder with comprehensive specifications, user flows, architecture diagrams, and implementation details.

```
/Accounting/
├── CLAUDE.md                    # Project overview & requirements
├── DOCS.md                      # This file - Documentation index
├── README.md                    # Quick start guide (to be created)
│
├── client/
│   ├── docs/
│   │   ├── architecture/
│   │   │   └── CLIENT_ARCHITECTURE.md    # Frontend architecture
│   │   └── features/
│   │       ├── feedback/
│   │       │   ├── SPEC.md              # Feature specification
│   │       │   ├── USER_FLOW.md         # User flow diagrams
│   │       │   └── COMPONENTS.md        # Component documentation
│   │       ├── waitlist/
│   │       │   ├── SPEC.md
│   │       │   ├── USER_FLOW.md
│   │       │   └── COMPONENTS.md
│   │       ├── transactions/
│   │       ├── wallets/
│   │       └── auth/
│   │           ├── SPEC.md
│   │           └── IMPLEMENTATION.md
│   └── src/                     # Frontend source code
│
└── server/
    ├── docs/
    │   ├── architecture/
    │   │   └── SERVER_ARCHITECTURE.md    # Backend architecture
    │   └── features/
    │       ├── feedback/
    │       │   ├── API.md               # API documentation
    │       │   ├── DATABASE.md          # Database schema
    │       │   └── CONTROLLER.md        # Controller logic
    │       ├── waitlist/
    │       │   ├── API.md
    │       │   ├── DATABASE.md
    │       │   └── CONTROLLER.md
    │       └── auth/
    │           ├── API.md
    │           ├── JWT.md
    │           └── SECURITY.md
    └── src/                     # Backend source code
```

## 📖 Documentation Standards

### For Each Feature, Include:

#### 1. **SPEC.md** - Feature Specification
- Overview and status
- User stories
- Functional requirements
- Non-functional requirements
- Data models
- API contracts
- UI mockups/wireframes
- Edge cases
- Testing checklist
- Future enhancements

#### 2. **USER_FLOW.md** - User Flow Diagrams
- Step-by-step user journeys
- Flow diagrams (Mermaid)
- Success/error paths
- Screenshots/wireframes

#### 3. **API.md** (Server-side)
- Endpoint documentation
- Request/response formats
- Authentication requirements
- Error codes
- Examples with curl commands

#### 4. **DATABASE.md** (Server-side)
- Schema definitions
- Relationships
- Indexes
- Migrations
- Query examples

#### 5. **COMPONENTS.md** (Client-side)
- Component hierarchy
- Props documentation
- State management
- Usage examples

#### 6. **ARCHITECTURE.md** (Per feature)
- System design diagrams
- Data flow
- Integration points
- Dependencies

## 🗂️ Current Documentation

### ✅ Completed Features

#### **Feedback**
- **Client**: `client/docs/features/feedback/`
  - SPEC.md - Full feature specification
  - USER_FLOW.md - User journey diagrams
  - COMPONENTS.md - React component docs
- **Server**: `server/docs/features/feedback/`
  - API.md - API endpoint documentation
  - DATABASE.md - Database schema
  - CONTROLLER.md - Business logic documentation

#### **Waitlist**
- **Client**: `client/docs/features/waitlist/`
  - SPEC.md - Full feature specification
  - USER_FLOW.md - User journey diagrams
  - COMPONENTS.md - React component docs
- **Server**: `server/docs/features/waitlist/`
  - API.md - API endpoint documentation
  - DATABASE.md - Database schema
  - CONTROLLER.md - Business logic documentation

### 📋 Planned Features

#### **Authentication** (Priority: High)
- **Client**: `client/docs/features/auth/`
  - SPEC.md - OAuth & JWT implementation
  - USER_FLOW.md - Login/signup flows
  - IMPLEMENTATION.md - Integration guide
- **Server**: `server/docs/features/auth/`
  - API.md - Auth endpoints
  - JWT.md - Token management
  - SECURITY.md - Security considerations

#### **Transactions** (Priority: High)
- Transaction listing & filtering
- Tagging system
- Attachment uploads
- Export functionality

#### **Wallets** (Priority: High)
- Wallet connection (read-only)
- Multi-chain support
- Balance tracking
- Transaction sync

## 📝 Documentation Templates

### Feature Specification Template
```markdown
# [Feature Name] - Specification

## Overview
Brief description and current status

## User Stories
As a [user type], I want to [action] so that [benefit]

## Functional Requirements
FR-1: [Requirement description]
- Acceptance criteria

## Non-Functional Requirements
NFR-1: Performance
NFR-2: Security
NFR-3: Usability

## Data Model
Schema definitions

## API Endpoints
Endpoint documentation

## UI Components
Component structure

## Testing Checklist
- [ ] Test case 1
- [ ] Test case 2

## Implementation Status
✅ Completed
🚧 In Progress
📋 Planned

## Related Documentation
Links to other docs
```

### User Flow Template
```markdown
# [Feature Name] - User Flow

## Happy Path
1. User action
2. System response
3. Result

## Alternate Paths
Error scenarios and edge cases

## Flow Diagram
[Mermaid diagram]

## Screenshots
[UI screenshots]
```

## 🔍 Finding Documentation

### By Feature
1. Decide if you need **client** or **server** documentation
2. Navigate to respective `docs/features/[feature-name]/` folder
3. Start with `SPEC.md` for overview

### By Type
- **Architecture**: `client/docs/architecture/` or `server/docs/architecture/`
- **API Reference**: `server/docs/features/*/API.md`
- **Database Schema**: `server/docs/features/*/DATABASE.md`
- **UI Components**: `client/docs/features/*/COMPONENTS.md`
- **User Flows**: `client/docs/features/*/USER_FLOW.md`

### Quick Links
- [Project Overview (CLAUDE.md)](./CLAUDE.md)
- [Client Architecture](./client/docs/architecture/CLIENT_ARCHITECTURE.md)
- [Server Architecture](./server/docs/architecture/SERVER_ARCHITECTURE.md)
- [Feedback Feature](./client/docs/features/feedback/SPEC.md)
- [Waitlist Feature](./client/docs/features/waitlist/SPEC.md)

## 🎯 Documentation Goals

### Why This Structure?
1. **Co-location**: Docs live near the code they document
2. **Feature-based**: Easy to find all docs for a specific feature
3. **Scalability**: Add new features without restructuring
4. **Clarity**: Clear separation between client and server concerns
5. **Completeness**: Multiple perspectives (spec, flow, API, DB)

### Best Practices
- Update docs with code changes
- Include diagrams for complex flows
- Provide code examples
- Document edge cases
- Keep specs up-to-date with implementation
- Link related documents

## 🛠️ Tooling

### Diagram Tools
- **Mermaid**: For flow diagrams (renders in GitHub/VSCode)
- **Excalidraw**: For architecture diagrams
- **Figma**: For UI mockups

### Documentation Format
- Markdown (`.md`) for all documentation
- Code blocks with syntax highlighting
- Tables for structured data
- Mermaid for diagrams

### VSCode Extensions (Recommended)
- Markdown All in One
- Markdown Preview Mermaid Support
- markdownlint
- Code Spell Checker

## 📊 Documentation Metrics

### Coverage by Feature
- ✅ Feedback: 100% (all docs complete)
- ✅ Waitlist: 100% (all docs complete)
- 📋 Auth: 0% (not started)
- 📋 Transactions: 0% (not started)
- 📋 Wallets: 0% (not started)
- 📋 Reports: 0% (not started)

### Documentation Health
- Total Features: 6
- Documented Features: 2
- In Progress: 0
- Planned: 4
- Coverage: 33%

## 🚀 Contributing to Documentation

### When to Update Docs
- Adding a new feature
- Changing API contracts
- Modifying database schema
- UI/UX updates
- Bug fixes affecting behavior

### Documentation Checklist
- [ ] SPEC.md created/updated
- [ ] USER_FLOW.md with diagrams
- [ ] API.md for backend changes
- [ ] DATABASE.md for schema changes
- [ ] COMPONENTS.md for new UI components
- [ ] ARCHITECTURE.md for system changes
- [ ] Code comments updated
- [ ] README updated if needed

## 📞 Need Help?

### Documentation Questions
- Check existing feature docs for examples
- Follow the templates provided above
- Keep docs concise but comprehensive

### Missing Documentation
If you can't find documentation for a feature:
1. Check if feature is implemented (look at code)
2. If implemented but not documented, create an issue
3. If planned but not implemented, check CLAUDE.md for roadmap

---

**Last Updated**: 2025-10-24
**Documentation Version**: 1.0.0
**Next Review**: When adding new features
