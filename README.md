# Pitch Deck Analyzer - AI-Powered Investor Readiness Platform

A sophisticated AI-powered application that analyzes pitch decks and provides comprehensive investor readiness assessment with visual analysis, smart Q&A, and industry benchmarking capabilities.

## 🚀 Features

### Core Functionality
- **📁 File Upload & Processing**: Supports PDF and PPTX pitch deck uploads with intelligent text extraction
- **📊 Investor Readiness Scoring**: Provides detailed scores out of 5.0 with comprehensive feedback
- **💬 AI-Powered Q&A**: Intelligent chat interface for asking specific questions about your pitch deck
- **💡 Smart Recommendations**: Contextual question suggestions based on analysis results
- **🎨 Visual Analysis**: Slide-by-slide visual design assessment and improvement suggestions
- **📈 Industry Benchmarking**: Compare your score against industry averages (Coming Soon)

### Advanced Features
- **🔍 Real-time Web Search**: Live market data integration for current industry insights
- **📋 Detailed Analysis**: Strengths, improvements, market analysis, and next steps
- **📄 Report Export**: Download comprehensive analysis reports
- **📱 Responsive Design**: Mobile-friendly interface with modern UI/UX

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: Modern, accessible component library
- **Lucide React**: Consistent icon library throughout the application
- **React Dropzone**: Drag-and-drop file upload functionality

### Backend
- **Next.js API Routes**: Server-side API endpoints with TypeScript
- **OpenAI GPT-4o-mini**: Advanced AI model for analysis and Q&A
- **PDF-parse**: Robust PDF text extraction
- **Mammoth**: PPTX text extraction with formatting preservation

### Development Tools
- **Cursor**: AI-powered code editor for enhanced development experience
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing and optimization
- **TypeScript**: Static type checking and IntelliSense

### No-Code/Low-Code Tools Used
- **shadcn/ui**: Pre-built component library for rapid UI development
- **Lucide React**: Comprehensive icon library for consistent iconography
- **React Dropzone**: Ready-to-use file upload component
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 📁 Project Structure

```
pitch-deck-analyzer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/route.ts           # File upload and analysis
│   │   │   ├── chat/route.ts             # Q&A functionality
│   │   │   ├── recommendations/route.ts  # Smart recommendations
│   │   │   └── visual-analysis/route.ts  # Visual analysis feature
│   │   ├── globals.css                   # Global styles
│   │   ├── layout.tsx                    # Root layout
│   │   └── page.tsx                      # Main application page
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   ├── FileUpload.tsx                # File upload component
│   │   ├── AnalysisResults.tsx           # Results display
│   │   ├── ChatInterface.tsx             # Chat interface
│   │   └── VisualAnalysis.tsx            # Visual analysis component
│   ├── hooks/
│   │   └── use-mobile.ts                 # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts                      # Utility functions
│   └── types/
│       └── index.ts                      # TypeScript type definitions
├── public/                               # Static assets
├── package.json                          # Dependencies and scripts
├── tailwind.config.ts                    # Tailwind configuration
├── tsconfig.json                         # TypeScript configuration
└── README.md                            # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**: Required for Next.js 15
- **npm or yarn**: Package manager
- **OpenAI API key**: For AI-powered features
- **Cursor**: Recommended AI-powered code editor

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

## 🎨 Features in Detail

### 📁 File Upload System
- **Supported Formats**: PDF and PPTX files
- **Drag & Drop**: Intuitive file upload interface
- **File Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages for unsupported files
- **Loading States**: Immediate visual feedback during processing

### 📊 Investor Readiness Analysis
- **Comprehensive Scoring**: 5-point scale with detailed breakdown
- **Industry Detection**: Automatic industry and stage identification
- **Market Analysis**: Real-time market insights integration
- **Strengths & Improvements**: Actionable feedback for enhancement
- **Financial Metrics**: Revenue growth and customer acquisition analysis
- **Risk Assessment**: Regulatory compliance and competitive pressure evaluation

### 🎨 Visual Analysis Feature
- **Slide-by-Slide Analysis**: Individual slide scoring and feedback
- **Design Principles**: Layout, typography, color, and imagery assessment
- **Visual Recommendations**: Specific improvement suggestions for each slide
- **Professional Standards**: Evaluation against industry visual benchmarks
- **Interactive Navigation**: Easy slide-to-slide navigation

### 💬 AI-Powered Chat Interface
- **Contextual Responses**: RAG system for relevant answers
- **Smart Recommendations**: AI-generated question suggestions
- **Real-time Interaction**: Instant responses to user queries
- **Conversation History**: Maintains chat context throughout session

## 🔧 API Endpoints

### POST `/api/upload`
Handles file uploads and initiates comprehensive analysis.

**Request:**
- `file`: PDF or PPTX file (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "filename": "pitch-deck.pdf",
  "textLength": 2500,
  "analysis": {
    "industry": "Technology",
    "stage": "Seed",
    "score": {
      "rating": 3.3,
      "strengths": ["Strong team credentials", "Clear value proposition"],
      "improvements": ["Add more financial metrics", "Include competitive analysis"]
    },
    "webSearchResults": [...],
    "visualAnalysis": {...}
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

### POST `/api/visual-analysis`
Provides slide-by-slide visual analysis.

**Request:**
```json
{
  "analysis": {...},
  "slideData": {
    "totalSlides": 8,
    "slideTypes": ["problem", "solution", "market"],
    "hasImages": true,
    "hasCharts": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "visualAnalysis": {
    "overallVisualScore": 2.8,
    "designPrinciples": {
      "layout": 3.2,
      "typography": 2.9,
      "color": 3.1
    },
    "slides": [...]
  }
}
```

## 🎨 Design System (Provided By Developer Handbook)

### Frontend Design Rules
- **Background**: Currently applying 18px by 18px light grey grid pattern
- **Icons**: Lucide React exclusively with Hourglass for loading states
- **Layout**: Centered content boxes with consistent spacing
- **Typography**: Geist Sans font, text-sm default, bold titles
- **Colors**: Off-black, off-white, muted greys/blues (no pure black/white)
- **Navigation**: Standardized back button positioning across all views
- **Loading States**: Immediate visual feedback for all user interactions

### Backend Architecture
- **API Keys**: Secure environment variable storage
- **Model**: GPT-4o-mini with optimized parameters
- **Logging**: Comprehensive console logging for debugging
- **Error Handling**: Graceful degradation and user-friendly error messages
- **Performance**: Optimized for fast response times

## 🔍 How It Works

### 1. File Processing Pipeline
1. **File Upload**: Drag-and-drop or click-to-upload interface
2. **Validation**: Client-side and server-side file type validation
3. **Text Extraction**: PDF-parse for PDFs, Mammoth for PPTX
4. **Analysis**: Industry detection, stage identification, content analysis
5. **Scoring**: Multi-factor investor readiness assessment
6. **Web Search**: Real-time market data integration
7. **Visual Analysis**: Slide-by-slide design assessment

### 2. RAG System (Retrieval-Augmented Generation)
1. **Context Creation**: Builds comprehensive context from analysis
2. **Question Processing**: Processes user queries with full context
3. **AI Response**: Generates contextual, relevant responses
4. **Recommendation Updates**: Continuously improves question suggestions

### 3. Visual Analysis Engine
1. **Slide Detection**: Identifies slide types and content
2. **Design Assessment**: Evaluates layout, typography, color usage
3. **Professional Standards**: Compares against industry benchmarks
4. **Recommendation Generation**: Provides specific improvement suggestions

### 4. Scoring Algorithm
The system evaluates pitch decks based on:
- **Financial Metrics**: Revenue projections, unit economics
- **Team Information**: Credentials, experience, roles
- **Market Analysis**: Market size, competitive landscape
- **Traction Metrics**: Customer acquisition, growth rates
- **Presentation Quality**: Clarity, professionalism, completeness

## 🎯 Innovative Features

### 🎨 Visual Analysis
- **Slide-by-Slide Assessment**: Individual scoring for each slide
- **Design Principles**: Layout, typography, color, imagery evaluation
- **Professional Standards**: Industry benchmark comparison
- **Actionable Feedback**: Specific improvement recommendations

### 📈 Industry Benchmarking (Coming Soon)
- **Industry Comparison**: Score comparison against sector averages
- **Sector Insights**: Industry-specific investor expectations
- **Common Patterns**: Typical strengths and improvements by industry
- **Competitive Context**: Understanding of market standards

## 🔧 Development Approach

### Architecture Decisions
1. **Next.js App Router**: Modern React framework with built-in API routes
2. **TypeScript**: Full type safety and enhanced developer experience
3. **Component-Based Architecture**: Reusable, maintainable components
4. **RAG Implementation**: Effective retrieval-augmented generation
5. **Progressive Enhancement**: Core functionality works without JavaScript

### Code Quality Standards
- **TypeScript**: Comprehensive type safety
- **ESLint**: Code quality and consistency enforcement
- **Clean Code**: Readable, maintainable codebase
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Optimized for fast loading and response times

### Development Tools
- **Cursor**: AI-powered code editor for enhanced productivity
- **Git**: Version control with feature branching
- **npm**: Package management and script execution
- **TypeScript**: Static type checking and IntelliSense

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

- **File Size Limits**: Client-side validation for optimal performance
- **API Rate Limiting**: Built-in rate limiting for OpenAI API
- **Caching**: Response caching for recommendations and analysis
- **Error Handling**: Graceful degradation for API failures
- **Loading States**: User-friendly loading indicators throughout

## 🔒 Security

- **File Validation**: Strict file type checking and size limits
- **Input Sanitization**: All user inputs are sanitized and validated
- **API Key Protection**: Secure environment variable storage
- **Error Messages**: Generic error messages to prevent information leakage
- **CORS**: Proper cross-origin resource sharing configuration

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the established code style
4. **Add tests if applicable**: Ensure new features are tested
5. **Submit a pull request**: Detailed description of changes

### Development Guidelines
- **TypeScript**: All new code must be properly typed
- **Component Structure**: Follow established component patterns
- **Error Handling**: Implement comprehensive error handling
- **Documentation**: Update README for new features
- **Testing**: Add tests for critical functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support or questions:
- **GitHub Issues**: Open an issue for bugs or feature requests
- **Documentation**: Check this README for usage instructions
- **Development Team**: Contact for technical questions

## 🎉 Acknowledgments

- **OpenAI**: For providing the GPT-4o-mini model
- **shadcn/ui**: For the excellent component library
- **Lucide**: For the comprehensive icon library
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Built with ❤️ using Next.js, TypeScript, OpenAI, and Cursor**
