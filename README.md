# Pitch Deck Analyzer - RAG System

A sophisticated RAG (Retrieval-Augmented Generation) application that analyzes pitch decks and provides investor readiness scores with personalized feedback and AI-powered Q&A capabilities.

## 🚀 Features

### Core Functionality
- **File Upload & Processing**: Supports PDF and PPTX pitch deck uploads with text extraction
- **Investor Readiness Scoring**: Provides detailed scores out of 5.0 with comprehensive feedback
- **AI-Powered Q&A**: Chat interface for asking specific questions about your pitch deck
- **Smart Recommendations**: Contextual question suggestions based on analysis results
- **Industry Benchmarking**: Compare your score against industry averages (Innovative Feature)

### Technical Features
- **RAG System**: Retrieval-augmented generation for contextual responses
- **Real-time Analysis**: Instant processing and scoring of uploaded documents
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Export Functionality**: Download detailed analysis reports

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Icon library
- **React Dropzone**: File upload functionality

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **OpenAI GPT-4o-mini**: AI model for analysis and Q&A
- **PDF-parse**: PDF text extraction
- **Mammoth**: PPTX text extraction

### No-Code Tools Used
- **shadcn/ui**: Pre-built component library for rapid UI development
- **Lucide React**: Icon library for consistent iconography
- **React Dropzone**: File upload component

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # File upload and analysis
│   │   ├── chat/route.ts        # Q&A functionality
│   │   └── recommendations/route.ts # Smart recommendations
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── FileUpload.tsx           # File upload component
│   ├── AnalysisResults.tsx      # Results display
│   └── ChatInterface.tsx        # Chat interface
└── lib/
    └── utils.ts                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:collinsmezie/pitch-deck-analyzer.git
   cd pitch-deck-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 API Endpoints

### POST `/api/upload`
Handles file uploads and initiates analysis.

**Request:**
- `file`: PDF or PPTX file (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "filename": "pitch-deck.pdf",
  "textLength": 2500,
  "analysis": {
    "industry": "SaaS",
    "stage": "Seed",
    "valueProposition": "...",
    "score": {
      "rating": 3.4,
      "strengths": ["..."],
      "improvements": ["..."],
      "overall": "Good"
    }
  }
}
```

### POST `/api/chat`
Handles Q&A functionality with RAG system.

**Request:**
```json
{
  "question": "How can I improve my financial projections?",
  "pitchDeckText": "...",
  "analysis": {...}
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on your pitch deck analysis...",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### POST `/api/recommendations`
Generates smart question recommendations.

**Request:**
```json
{
  "analysis": {...},
  "previousQuestions": ["..."]
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    "How can I strengthen my financial projections?",
    "What traction metrics should I include?"
  ]
}
```

## 🎨 Design System

### Frontend Rules (Company Style Guide)
- **Background**: 24px by 24px light grey grid pattern
- **Icons**: Lucide React exclusively with Hourglass for loading states
- **Layout**: Centered content boxes with 600px fixed height
- **Typography**: Geist Sans font, text-sm default, bold titles
- **Colors**: Off-black, off-white, muted greys/blues (no pure black/white)
- **Footer**: "© 2025 Digress, All Rights Reserved" in text-xs grey

### Backend Rules
- **API Keys**: Stored in .env file as OPENAI_API_KEY
- **Model**: gpt-4o-mini with current parameters (max_completion_tokens)
- **Logging**: Detailed console logging for all API routes
- **Clean Code**: Adherence to clean code principles

## 🔍 How It Works

### 1. File Processing Pipeline
1. User uploads PDF/PPTX file
2. Text extraction using pdf-parse or mammoth
3. Industry and stage detection
4. Value proposition extraction
5. Scoring algorithm analysis

### 2. RAG System
1. Context creation from pitch deck analysis
2. Question processing with OpenAI
3. Contextual response generation
4. Smart recommendation updates

### 3. Scoring Algorithm
The system evaluates pitch decks based on:
- Financial metrics presence
- Team information quality
- Market size analysis
- Competitive landscape
- Traction metrics
- Overall presentation quality

## 🎯 Innovative Feature: Industry Benchmarking

The application includes an innovative **Industry Benchmarking** feature that:
- Compares user scores against industry averages
- Provides industry-specific insights
- Identifies common strengths and improvements
- Helps users understand investor expectations in their sector

This feature helps founders contextualize their scores and understand what investors typically look for in their specific industry.

## 🔧 Development Approach

### Architecture Decisions
1. **Next.js App Router**: Modern React framework with built-in API routes
2. **TypeScript**: Type safety and better developer experience
3. **Component-Based Architecture**: Reusable, maintainable components
4. **RAG Implementation**: Simple but effective retrieval-augmented generation
5. **Progressive Enhancement**: Core functionality works without JavaScript

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Clean Code**: Readable, maintainable codebase
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Optimized for fast loading and response times

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

## 📊 Performance Considerations

- **File Size Limits**: Implemented client-side validation
- **API Rate Limiting**: Built-in rate limiting for OpenAI API
- **Caching**: Response caching for recommendations
- **Error Handling**: Graceful degradation for API failures
- **Loading States**: User-friendly loading indicators

## 🔒 Security

- **File Validation**: Strict file type checking
- **Input Sanitization**: All user inputs are sanitized
- **API Key Protection**: Environment variable storage
- **Error Messages**: Generic error messages to prevent information leakage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**
