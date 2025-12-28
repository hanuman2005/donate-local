# Contributing to LifeLoop

> Thank you for considering contributing to LifeLoop! This guide will help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Our Standards

**Positive Behavior:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Accepting constructive criticism gracefully
- ✅ Focusing on what's best for the community
- ✅ Showing empathy towards others

**Unacceptable Behavior:**
- ❌ Harassment, trolling, or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information
- ❌ Spam or self-promotion
- ❌ Any conduct that could be considered unprofessional

### Enforcement

Violations of the Code of Conduct will result in:
1. **First offense:** Warning from maintainers
2. **Second offense:** Temporary ban (1 week)
3. **Third offense:** Permanent ban

Report violations to: madenenihanumanturao@gmail.com

---

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting a bug report:**
- Check existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Collect relevant information (screenshots, logs, etc.)

**Good bug report includes:**
```markdown
**Bug Description:**
Clear description of the problem

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., v1.0.0]

**Screenshots:**
If applicable

**Additional Context:**
Any other relevant information
```

### ✨ Suggesting Features

**Before submitting a feature request:**
- Check the [roadmap](./ROADMAP.md) for planned features
- Search existing feature requests
- Consider if it aligns with project goals

**Good feature request includes:**
```markdown
**Feature Description:**
Clear description of the feature

**Problem It Solves:**
What user problem does this address?

**Proposed Solution:**
How should it work?

**Alternative Solutions:**
Other approaches considered

**Use Case:**
Real-world example of usage

**Priority:**
Low / Medium / High (with justification)
```

### 🔧 Contributing Code

**Good first issues:**
- Look for `good-first-issue` label
- Focus on bug fixes or small enhancements
- Ask questions if anything is unclear

**Major contributions:**
- Open an issue first to discuss
- Wait for maintainer approval
- Follow the development guidelines

---

## Development Setup

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 5.0.0
Git
```

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/lifeloop.git
cd lifeloop

# Add upstream remote
git remote add upstream https://github.com/hanuman2005/lifeloop.git
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Setup

```bash
# Backend .env
cd backend
cp .env.example .env
# Edit .env with your credentials

# Frontend .env
cd ../frontend
cp .env.example .env
# Edit .env with your configuration
```

### Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Project Structure

```
lifeloop/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # React context
│       ├── hooks/       # Custom hooks
│       ├── services/    # API services
│       ├── utils/       # Utility functions
│       └── i18n/        # Translations
│
├── README.md            # Project overview
├── FEATURES.md          # Feature documentation
├── ARCHITECTURE.md      # Technical docs
├── ROADMAP.md           # Future plans
└── CONTRIBUTING.md      # This file
```

---

## Coding Standards

### JavaScript/React Style Guide

**Use ESLint configuration:**
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**General Rules:**
- Use `const` by default, `let` when needed, never `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate
- Prefer async/await over promises
- Use meaningful variable names

**Good Examples:**
```javascript
// ✅ Good
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// ✅ Good
const { name, email } = user;

// ✅ Good
const message = `Hello, ${name}!`;
```

**Bad Examples:**
```javascript
// ❌ Bad
var x = function(y) {
  return User.findById(y).then(function(z) {
    return z;
  });
};

// ❌ Bad
var n = user.name;
var e = user.email;

// ❌ Bad
var msg = "Hello, " + n + "!";
```

### React Component Guidelines

**Functional Components:**
```javascript
// ✅ Good: Functional component with hooks
import { useState, useEffect } from 'react';

const ListingCard = ({ listing }) => {
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    // Side effects here
  }, []);
  
  return (
    <div>
      <h3>{listing.title}</h3>
      <button onClick={() => setLiked(!liked)}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

export default ListingCard;
```

**Component Organization:**
```javascript
// 1. Imports
import { useState } from 'react';
import styled from 'styled-components';

// 2. Styled components (if using styled-components)
const Container = styled.div`
  padding: 20px;
`;

// 3. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3a. Hooks
  const [state, setState] = useState(null);
  
  // 3b. Functions
  const handleClick = () => {
    setState('clicked');
  };
  
  // 3c. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3d. Render
  return (
    <Container>
      <button onClick={handleClick}>Click</button>
    </Container>
  );
};

// 4. Export
export default MyComponent;
```

### Backend Structure

**Controller Pattern:**
```javascript
// controllers/listingController.js
const Listing = require('../models/Listing');

// ✅ Good: Async/await with error handling
exports.getListings = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    const listings = await Listing.find(query)
      .populate('donor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    next(error);
  }
};
```

**Route Pattern:**
```javascript
// routes/listings.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const listingController = require('../controllers/listingController');

// Public routes
router.get('/', listingController.getListings);
router.get('/:id', listingController.getListing);

// Protected routes
router.post('/', auth, listingController.createListing);
router.put('/:id', auth, listingController.updateListing);
router.delete('/:id', auth, listingController.deleteListing);

module.exports = router;
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Variables** | camelCase | `userName`, `listingId` |
| **Constants** | UPPER_SNAKE_CASE | `API_URL`, `MAX_SIZE` |
| **Functions** | camelCase, verb prefix | `getUserById`, `handleClick` |
| **Components** | PascalCase | `ListingCard`, `UserProfile` |
| **Files (React)** | PascalCase | `ListingCard.js` |
| **Files (Other)** | camelCase | `helpers.js`, `api.js` |
| **Models** | PascalCase, singular | `User`, `Listing` |
| **Routes** | kebab-case | `waste-analysis.js` |

### Comments

**Use comments for:**
- Complex algorithms
- Non-obvious business logic
- TODO items
- Workarounds

**Don't comment:**
- Obvious code
- What the code does (code should be self-explanatory)

```javascript
// ✅ Good: Explains WHY
// Using setTimeout to debounce API calls and reduce server load
const debouncedSearch = setTimeout(() => {
  fetchResults(query);
}, 300);

// ❌ Bad: Explains WHAT (obvious)
// Set user name to 'John'
const userName = 'John';
```

---

## Git Workflow

### Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| **Feature** | `feature/` | `feature/ai-upcycling` |
| **Bug Fix** | `fix/` | `fix/qr-scanner-crash` |
| **Hotfix** | `hotfix/` | `hotfix/security-patch` |
| **Docs** | `docs/` | `docs/update-readme` |
| **Refactor** | `refactor/` | `refactor/api-structure` |
| **Test** | `test/` | `test/chat-integration` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
# Good commits
feat(ai): add multi-image analysis
fix(chat): resolve typing indicator bug
docs(readme): update installation steps
refactor(api): simplify listing controller
test(auth): add JWT validation tests

# Bad commits
fixed bug
update
WIP
asdlkfj
```

### Workflow Steps

```bash
# 1. Update your fork
git checkout main
git fetch upstream
git merge upstream/main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat(scope): description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open Pull Request on GitHub
```

---

## Pull Request Process

### Before Submitting PR

**Checklist:**
- [ ] Code follows style guidelines
- [ ] No linting errors (`npm run lint`)
- [ ] Tested locally (frontend + backend)
- [ ] Updated documentation if needed
- [ ] Added/updated tests if applicable
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Title Format

```
<type>(<scope>): <description>

# Examples
feat(ai): implement multi-image analysis
fix(chat): resolve message ordering issue
docs(contributing): add git workflow section
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #123

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Process

1. **Automated Checks:** CI/CD runs linting and tests
2. **Code Review:** Maintainer reviews code quality
3. **Feedback:** Address any requested changes
4. **Approval:** Once approved, maintainer merges
5. **Cleanup:** Delete your branch after merge

**Review Timeline:**
- Small PRs: 1-2 days
- Medium PRs: 3-5 days
- Large PRs: 1-2 weeks

---

## Testing Guidelines

### Manual Testing

**Before submitting PR, test:**
1. Happy path (expected usage)
2. Edge cases (empty inputs, max limits)
3. Error handling (invalid data, network errors)
4. Cross-browser (Chrome, Firefox, Safari)
5. Mobile responsive (if UI change)

**Testing Checklist:**
```markdown
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Loading states work
- [ ] Error messages display correctly
- [ ] Navigation works
- [ ] Forms validate properly
- [ ] Data persists correctly
```

### Unit Tests (Future)

```javascript
// Example unit test (to be added)
import { render, screen } from '@testing-library/react';
import ListingCard from './ListingCard';

describe('ListingCard', () => {
  test('renders listing title', () => {
    const listing = { title: 'Test Listing' };
    render(<ListingCard listing={listing} />);
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
  });
});
```

### Integration Tests (Future)

```javascript
// Example integration test (to be added)
const request = require('supertest');
const app = require('../server');

describe('POST /api/listings', () => {
  test('creates new listing', async () => {
    const response = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', category: 'Food' });
    
    expect(response.status).toBe(201);
    expect(response.body.listing.title).toBe('Test');
  });
});
```

---

## Documentation

### Code Documentation

**Document:**
- Complex algorithms
- Public API functions
- Reusable components
- Configuration options

**JSDoc Example:**
```javascript
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
function haversineDistance(coord1, coord2) {
  // Implementation
}
```

### README Updates

If your PR changes:
- Installation steps → Update README.md
- API endpoints → Update DOCS.md
- Features → Update FEATURES.md
- Architecture → Update ARCHITECTURE.md

---

## Questions?

**Need help?**
- Open a [GitHub Discussion](https://github.com/hanuman2005/lifeloop/discussions)
- Email: madenenihanumanturao@gmail.com
- Tag maintainers in issues/PRs

**Resources:**
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/)

---

## Recognition

Contributors will be:
- Listed in README.md Contributors section
- Mentioned in release notes
- Given credit in changelog

**Top contributors may:**
- Become project maintainers
- Get early access to new features
- Receive recommendation letters

---

## Thank You!

Every contribution, no matter how small, makes LifeLoop better. Thank you for being part of the circular economy revolution! 🌍♻️

---

**Last Updated:** December 2025  
**Maintained by:** [@hanuman2005](https://github.com/hanuman2005)