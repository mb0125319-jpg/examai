# ExamAI Development Roadmap

## Architecture Overview

### Database Schema
- **users**: User accounts with subscription tier (free/premium)
- **notes**: Uploaded study notes with metadata
- **summaries**: AI-generated summaries of notes
- **quizzes**: Generated quizzes from notes
- **quiz_responses**: User quiz answers and scores
- **flashcards**: Auto-generated flashcards from notes
- **study_plans**: AI-generated study schedules
- **weakness_analysis**: Tracked weak areas and improvement recommendations
- **subscriptions**: User subscription status and billing info

### Tech Stack
- **Frontend**: React 19 + TypeScript + TailwindCSS 4
