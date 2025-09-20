📝 Automated Resume Relevance Check System
Project Overview

This project is an AI-powered Resume Relevance Check System designed to help placement teams efficiently evaluate resumes against job descriptions. It automates the resume screening process by generating a Relevance Score, highlighting missing skills/projects, providing a suitability verdict, and offering actionable feedback to candidates.

The system is built on Lovable, leveraging a modern tech stack with React, TypeScript, Tailwind CSS, and AI integrations for semantic matching.

🌐 Project URL

Access your Lovable project here:
https://lovable.dev/projects/f059471e-83ca-415d-aa57-a7b4d437cbdf

⚡ Features

Upload Job Descriptions (PDF/DOCX).

Upload Resumes from candidates.

Automatic Resume Parsing and text extraction.

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

Database: Lovable collections (PostgreSQL under the hood)

Deployment: Directly via Lovable (no extra setup needed)

🚀 Getting Started
Option 1: Edit in Lovable

Open the Lovable Project
.

Start editing or prompting to modify your application.

Changes are committed automatically.

Option 2: Edit Locally

Clone the repository:

git clone <https://github.com/arpit00000/cv-clarity-score/edit/main/README.md>
cd <Automated Resume Relevance Check System>


Install dependencies:

npm install


Start the development server:

npm run dev


Open http://localhost:5173 in your browser to preview.

Option 3: Edit on GitHub / Codespaces

Navigate to the file on GitHub → Click the pencil icon → Edit → Commit.

Or launch a GitHub Codespace for an IDE-like environment online.

📦 Project Structure
/src
  ├─ components/       # React UI components
  ├─ pages/            # Dashboard & upload pages
  ├─ services/         # API calls / Python AI integration
  └─ styles/           # Tailwind & global CSS
collections/           # Lovable database schema

🔑 Environment Variables

OPENAI_API_KEY – For AI embeddings and semantic analysis

ANTHROPIC_API_KEY – Optional, if using Claude

📤 Deployment

Open your project in Lovable.

Click Share → Publish.

Optional: Connect a custom domain via Project > Settings > Domains.

🎯 Usage

Placement team uploads Job Descriptions.

Candidates upload their resumes.

Click Analyze → Relevance Score, Missing Skills, Verdict, and Feedback are displayed.

Filter and search resumes by job role, score, or location.

✅ Contributing

Fork the repository → Create a feature branch → Submit a pull request.

Use Lovable prompts to generate new components or workflows.

📖 References

Lovable Documentation

OpenAI API

Anthropic Claude API
