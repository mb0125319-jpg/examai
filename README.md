# ExamAI – Smart Study Assistant

An elegant, AI-powered study platform that helps students study faster and get better grades using advanced AI features.

## 🎯 Overview

ExamAI is a comprehensive web application designed to revolutionize how students study. With AI-powered features, personalized learning tools, and intelligent analytics, students can focus their study time where it matters most.

## ✨ Features

### Free Tier
- **📝 Upload Notes** - Upload and manage your study materials
- **✍️ AI Summaries** - Get AI-generated summaries of your notes with key points
- **🧠 Basic Quizzes** - Generate practice questions from your notes
- **📊 Progress Tracker** - Monitor your study activity and quiz scores

### Premium Tier ($7.99/month or $49/year)
- **🎯 AI Exam Predictor** - Predict likely exam questions with confidence scores
- **🤖 Smart Quiz Generator** - Unlimited adaptive quizzes targeting weak areas
- **🎴 Instant Notes-to-Flashcards** - Automatically convert notes to flashcards
- **📈 Weakness Analyzer** - Identify weak areas and get improvement recommendations
- **📅 AI Study Planner** - Get personalized daily study schedules

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + tRPC
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **AI**: Integrated LLM for summaries, quiz generation, and predictions
- **Charts**: Recharts for data visualization

### Project Structure
```
examai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app router
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC route definitions
│   ├── db.ts              # Database helpers
│   └── _core/             # Core infrastructure
├── drizzle/               # Database schema and migrations
└── shared/                # Shared types and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL/TiDB database

### Installation

1. **Install dependencies**
   ```bash
   cd examai
   pnpm install
   ```

2. **Set up environment variables**
   - Database connection string in `DATABASE_URL`
   - OAuth credentials for Manus
   - LLM API keys

3. **Run database migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`

## 📋 Pages & Routes

### Public Pages
- `/` - Landing page with hero, features, and pricing
- `/pricing` - Detailed pricing and FAQ

### Authenticated Pages
- `/dashboard` - Main dashboard with feature overview
- `/notes` - Upload and manage study notes
- `/quizzes` - Generate and take quizzes
- `/progress` - View study analytics and progress

### Premium Feature Pages
- `/exam-predictor` - AI Exam Predictor (Premium)
- `/smart-quiz` - Smart Quiz Generator (Premium)
- `/flashcards` - Instant Notes-to-Flashcards (Premium)
- `/weakness-analyzer` - Weakness Analyzer (Premium)
- `/study-planner` - AI Study Planner (Premium)

## 🔧 Development

### Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Testing
pnpm test             # Run tests with Vitest

# Type checking
pnpm check            # TypeScript type checking

# Database
pnpm drizzle-kit generate  # Generate migrations
pnpm drizzle-kit migrate   # Apply migrations

# Building
pnpm build            # Build for production
pnpm start            # Start production server
```

### Database Schema

Key tables:
- `users` - User accounts with OAuth integration
- `subscriptions` - User subscription tiers (free/premium)
- `notes` - Uploaded study notes
- `summaries` - AI-generated note summaries
- `quizzes` - Generated quizzes
- `quizResponses` - Quiz attempt results
- `flashcards` - Generated flashcards
- `studyPlans` - AI-generated study schedules
- `examPredictions` - Predicted exam questions
- `weaknessAnalysis` - Topic weakness analysis

## 🔐 Authentication

ExamAI uses Manus OAuth for secure user authentication. The authentication flow:
1. User clicks "Sign in" on landing page
2. Redirected to Manus OAuth portal
3. User authenticates and grants permissions
4. Redirected back to app with session cookie
5. Session persists across page reloads

## 💳 Pricing Model

| Feature | Free | Premium |
|---------|------|---------|
| Notes Upload | ✓ | ✓ |
| AI Summaries | ✓ | ✓ |
| Basic Quizzes | ✓ | ✓ |
| Progress Tracker | ✓ | ✓ |
| AI Exam Predictor | ✗ | ✓ |
| Smart Quiz Generator | ✗ | ✓ |
| Flashcards | ✗ | ✓ |
| Weakness Analyzer | ✗ | ✓ |
| Study Planner | ✗ | ✓ |
| Price | Free | $7.99/mo or $49/yr |

## 🎨 Design System

- **Color Palette**: Blue primary (#2563eb), Purple accents (#7c3aed)
- **Typography**: System fonts with Tailwind typography
- **Components**: shadcn/ui components for consistency
- **Spacing**: 4px base unit with Tailwind scale
- **Responsiveness**: Mobile-first design approach

## 🔄 API Integration

### tRPC Procedures

All backend operations use tRPC for type-safe API calls:

```typescript
// Example: Create a note
trpc.notes.create.useMutation()

// Example: Get user's quizzes
trpc.quizzes.list.useQuery()

// Example: Submit quiz
trpc.quizResponses.submit.useMutation()
```

### LLM Integration

The app uses integrated LLM for:
- Generating note summaries
- Creating quiz questions
- Predicting exam questions
- Generating flashcards
- Creating study schedules

## 📊 Analytics

The Progress Tracker provides:
- Total notes uploaded
- Quizzes completed
- Average quiz scores
- Weekly activity charts
- Recent quiz results

## 🚀 Deployment

The app is ready for deployment to:
- Vercel (recommended for frontend)
- Docker containers
- Traditional Node.js hosting

Build for production:
```bash
pnpm build
pnpm start
```

## 📝 Best Practices

### Frontend Development
- Use tRPC hooks for all data fetching
- Leverage shadcn/ui for consistent UI
- Implement optimistic updates for better UX
- Always handle loading and error states

### Backend Development
- Use `protectedProcedure` for authenticated routes
- Validate all inputs with Zod schemas
- Return typed responses for type safety
- Log errors for debugging

### Database
- Always use Drizzle ORM for queries
- Generate migrations for schema changes
- Keep schema and TypeScript types in sync

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database server is running
- Check network connectivity

### OAuth Issues
- Verify OAuth credentials are set
- Check redirect URLs match configuration
- Clear browser cookies if having issues

### LLM API Errors
- Verify API keys are valid
- Check rate limits haven't been exceeded
- Review error logs for details

## 📚 Documentation

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in `.manus-logs`
3. Contact support at support@examai.app

---

**Built with ❤️ by the ExamAI team**
