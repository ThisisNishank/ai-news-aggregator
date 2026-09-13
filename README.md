
# KhabarJunction

**KhabarJunction** is a full-stack, AI-powered news aggregation platform that enables users to discover, search, personalize, save, and summarize news articles through a unified web application.

The platform integrates external news APIs, user authentication, persistent data storage, and generative AI to provide a personalized and efficient news-reading experience.

## Live Demo

[Visit KhabarJunction](https://khabarjunction.vercel.app)

## GitHub Repository

[View Source Code](https://github.com/ThisisNishank/ai-news-aggregator)

## Features

- **News Aggregation:** Retrieves news articles using the NewsData.io API.
- **News Discovery:** Allows users to explore articles by category and topic.
- **Search Functionality:** Supports keyword-based news search.
- **User Authentication:** Provides registration, login, and session management using Better Auth.
- **Personalized News Feed:** Displays news based on user-selected interests.
- **Saved Articles:** Allows authenticated users to bookmark and manage articles.
- **AI-Powered Summarization:** Uses Google Gemini to generate concise article summaries.
- **Key Takeaways:** Provides three important takeaways for each generated summary.
- **AI Summary Caching:** Stores generated summaries in MongoDB to reduce repeated AI requests.
- **Cache Validation:** Validates cached summaries against article metadata to prevent outdated results.
- **Responsive Interface:** Supports desktop and mobile screen sizes.

## Screenshots

### Homepage

![KhabarJunction Homepage](./screenshots/homepage.png)

### AI-Powered Article Summary

![AI Article Summary](./screenshots/ai-summary.png)

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Lucide React |
| Backend | Next.js Route Handlers, Node.js, TypeScript |
| Database | MongoDB, Mongoose, MongoDB Atlas |
| Authentication | Better Auth |
| Artificial Intelligence | Google Gemini API, `@google/genai` |
| External API | NewsData.io |
| Deployment | Vercel |
| Version Control | Git, GitHub |

## Application Workflow

```text
User
 |
 v
Next.js Frontend
 |
 v
Next.js Route Handlers
 |
 +--------------------+
 |                    |
 v                    v
NewsData.io       MongoDB Atlas
 |                    |
 v                    |
News Articles     Users, Preferences,
                  Saved Articles,
                  AI Summary Cache
 |
 v
Google Gemini API
 |
 v
Article Summary
and Key Takeaways
 |
 v
Frontend Display
```

## Project Structure

```text
ai-news-aggregator/
├── app/
│   ├── api/
│   ├── login/
│   ├── register/
│   ├── saved/
│   ├── preferences/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── models/
├── public/
├── screenshots/
│   ├── homepage.png
│   └── ai-summary.png
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

Ensure that the following are installed:

- Node.js 20 or later
- npm
- Git
- MongoDB database
- NewsData.io API key
- Google Gemini API key


## Deployment

KhabarJunction is deployed using **Vercel**.

**Live Application:** [https://khabarjunction.vercel.app](https://khabarjunction.vercel.app)

For production deployment, configure the required environment variables in the Vercel project settings.





## Author

**Nishank Chourey**

Computer Science and Engineering  
Vellore Institute of Technology, Bhopal

### GitHub

[https://github.com/ThisisNishank](https://github.com/ThisisNishank)

### Project Repository

[https://github.com/ThisisNishank/ai-news-aggregator](https://github.com/ThisisNishank/ai-news-aggregator)