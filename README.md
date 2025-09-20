📝 Automated Resume Relevance Check System
Project Overview

I developed an AI-powered Resume Relevance Check System to help placement teams efficiently evaluate resumes against job descriptions. The system automates resume screening by generating a Relevance Score, highlighting missing skills/projects, providing a suitability verdict, and offering personalized feedback to candidates.

The platform leverages a modern tech stack with React, TypeScript, Tailwind CSS, and AI-powered semantic matching for accurate evaluation.

🌐 Project URL

Access the project here:
https://github.com/arpit00000/cv-clarity-score

⚡ Features

Upload Job Descriptions (PDF/DOCX).

Upload Resumes from candidates.

Automatic resume parsing and text extraction.

Hard Match: Keyword & skill checks.

Semantic Match: AI-powered embedding similarity.

Generate Relevance Score (0–100).

Provide Verdict: High / Medium / Low suitability.

Highlight Missing Skills, Certifications, Projects.

Offer Personalized Improvement Feedback.

Searchable Dashboard for placement teams.

🛠 Tech Stack

Frontend: React, TypeScript, Tailwind CSS, shadcn-ui, Vite

Backend / AI: Python (resume parsing & scoring), OpenAI/Claude embeddings

Database: PostgreSQL (custom schema for jobs, resumes, and matches)

Deployment: Hosted on cloud / server of choice

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/arpit00000/cv-clarity-score.git
cd cv-clarity-score

2. Install Dependencies
npm install

3. Start Development Server
npm run dev


Open http://localhost:5173
 in your browser to preview.

📦 Project Structure
/src
  ├─ components/       # React UI components
  ├─ pages/            # Dashboard & upload pages
  ├─ services/         # API calls / Python AI integration
  └─ styles/           # Tailwind & global CSS
collections/           # Database schema for jobs, resumes, matches

🔑 Environment Variables

OPENAI_API_KEY – For AI embeddings and semantic analysis

ANTHROPIC_API_KEY – Optional, if using Claude

📤 Deployment

Host on any cloud server (Vercel, Netlify, AWS, etc.)

Connect a custom domain if needed.

🎯 Usage

Placement team uploads Job Descriptions.

Candidates upload their resumes.

Click Analyze → system displays Relevance Score, Missing Skills, Verdict, and Feedback.

Filter and search resumes by job role, score, or location.

✅ Contributing

Fork the repository → Create a feature branch → Submit a pull request.

Add new components, scoring improvements, or AI workflows.

📖 References

OpenAI API

Anthropic Claude API

React, TypeScript, Tailwind CSS documentation
