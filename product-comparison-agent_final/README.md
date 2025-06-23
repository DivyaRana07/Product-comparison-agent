# AI Product Comparison Agent

A sophisticated AI-powered product comparison tool that leverages multiple browser automation methods to scrape, analyze, and compare products from across the web. Built with Next.js, TypeScript, and the AI SDK.

## 🚀 Features

### Multi-Method Browser Automation
- **ScrapybaraBrowser**: Advanced browser automation with AI-powered element detection
- **Playwright + Custom Functions**: Real browser automation with custom LLM-controlled functions  
- **Puppeteer + AI Vision**: AI vision analysis with OCR and visual element identification
- **Intelligent Fallback System**: Continues operation even when browser automation fails

### AI-Powered Analysis
- Uses GPT-4o Mini for intelligent product comparison
- Generates comprehensive analysis covering price, features, pros/cons
- Creates professional README files with detailed comparisons
- Structured data extraction and normalization

### Advanced Logging & Monitoring
- Comprehensive logging system using Maxim Logger
- Real-time progress tracking with 5-tab interface
- Error handling and debugging capabilities
- Performance monitoring and resource usage tracking

### Modern UI/UX
- Clean, responsive interface built with shadcn/ui
- Tab-based navigation (Setup, Progress, Results, Logs, Monitoring)
- Real-time status updates during processing
- Downloadable comparison reports

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- OpenAI API key

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd product-comparison-agent
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` and add your OpenAI API key:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Install browser dependencies (optional for full automation)**
   \`\`\`bash
   npx playwright install chromium
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Step 1: Product Setup
1. Enter the first product name (e.g., "iPhone 15 Pro")
2. Enter the second product name (e.g., "Samsung Galaxy S24 Ultra")
3. Select browser automation methods:
   - **ScrapybaraBrowser**: Best for complex, dynamic websites
   - **Playwright + Custom Functions**: Reliable for e-commerce sites
   - **Puppeteer + AI Vision**: Excellent for visual analysis

### Step 2: Start Comparison
1. Click "Start AI Product Comparison"
2. Monitor progress in the Progress tab
3. View real-time logs as the system works

### Step 3: Review Results
1. **Results Tab**: View comprehensive comparison analysis
2. **Individual Product Cards**: Detailed specifications and features
3. **Download README**: Get a formatted markdown report

### Step 4: Monitor Performance
1. **Logs Tab**: Detailed system logs with timestamps
2. **Monitoring Tab**: Performance metrics and error tracking

## 🏗 Architecture

### Frontend Components
- **Main Interface** (`app/page.tsx`): Primary user interface with tab navigation
- **Product Cards**: Reusable components for displaying product information
- **UI Components**: shadcn/ui components for consistent design

### Backend API
- **Compare Products Route** (`app/api/compare-products/route.ts`): Main API endpoint
- **Data Processing**: Merges results from multiple scrapers
- **AI Integration**: Uses OpenAI for analysis and README generation

### Browser Automation Methods

#### 1. ScrapybaraBrowser (`lib/scrapybara-browser.ts`)
- **Purpose**: Advanced AI-powered browser automation
- **Features**: AI element detection, smart interaction patterns
- **Best For**: Complex websites with dynamic content
- **Capabilities**:
  - E-commerce search with AI navigation
  - Price comparison across multiple sites
  - Review analysis with sentiment detection
  - Specification lookup with technical databases

#### 2. Playwright Scraper (`lib/playwright-scraper.ts`)
- **Purpose**: Reliable multi-site scraping
- **Features**: Custom extraction functions, robust error handling
- **Best For**: E-commerce platforms and structured sites
- **Supported Sites**:
  - Amazon.com
  - BestBuy.com
  - Target.com
  - Walmart.com

#### 3. Puppeteer Scraper (`lib/puppeteer-scraper.ts`)
- **Purpose**: Visual analysis and OCR capabilities
- **Features**: Screenshot analysis, text extraction, visual feature detection
- **Best For**: Image-heavy sites and visual product analysis
- **Vision Tasks**:
  - Product image analysis
  - Screenshot specification extraction
  - OCR text extraction
  - UI element detection

### Logging System
- **MaximLogger** (`lib/maxim-logger.ts`): Comprehensive logging with levels
- **Real-time Updates**: Live log streaming to frontend
- **Error Tracking**: Detailed error reporting and debugging

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for future integrations)
# SUPABASE_URL=your_supabase_url
# UPSTASH_REDIS_URL=your_redis_url
\`\`\`

### Browser Method Selection
All three methods are selected by default and work together:

1. **ScrapybaraBrowser**: Provides AI-powered intelligent scraping
2. **Playwright**: Delivers reliable e-commerce data
3. **Puppeteer**: Adds visual analysis and OCR capabilities

## 📊 Data Sources & Methodology

### Scraping Strategy
1. **Multi-Source Approach**: Scrapes from multiple e-commerce platforms
2. **Data Normalization**: Merges and deduplicates information
3. **Quality Validation**: AI-powered data quality checks
4. **Error Resilience**: Continues operation even if some sources fail

### Data Points Collected
- **Product Specifications**: Technical details and features
- **Pricing Information**: Current prices across retailers
- **Customer Reviews**: Ratings and review summaries  
- **Availability Status**: Stock levels and shipping options
- **Visual Features**: Image analysis and visual characteristics

### AI Analysis Process
1. **Data Aggregation**: Combines information from all sources
2. **Feature Extraction**: Identifies key product characteristics
3. **Comparative Analysis**: AI-powered side-by-side comparison
4. **Report Generation**: Creates structured markdown reports

## 🚨 Error Handling & Fallbacks

### Intelligent Fallback System
- **Graceful Degradation**: Continues with available data if some scrapers fail
- **AI Simulation**: Uses intelligent estimation when browser automation fails
- **Detailed Logging**: Comprehensive error tracking and reporting
- **User Feedback**: Clear error messages and recovery suggestions

### Common Scenarios

#### Browser Launch Failures
- **Playwright/Puppeteer Issues**: Falls back to AI simulation
- **Missing Dependencies**: Provides helpful setup instructions
- **System Limitations**: Uses intelligent data estimation

#### Network Issues
- **Site Blocking**: Switches to alternative data sources
- **Rate Limiting**: Implements delays and retry logic
- **Timeout Errors**: Falls back to cached or estimated data

## 🔒 Security & Privacy

### Data Handling
- **No Data Storage**: Product data is not permanently stored
- **API Key Security**: Environment variables protect sensitive keys
- **Request Sanitization**: Input validation prevents injection attacks

### Privacy Considerations
- **Temporary Processing**: Data exists only during comparison process
- **No User Tracking**: No personal information collected or stored
- **Secure Communication**: HTTPS for all external requests

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add `OPENAI_API_KEY` in Vercel dashboard
3. **Deploy**: Automatic deployment on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🧪 Testing

### Running Tests
\`\`\`bash
# Test individual components
npm run test

# Test API endpoints
curl -X POST http://localhost:3000/api/compare-products \
  -H "Content-Type: application/json" \
  -d '{"product1":"iPhone 15","product2":"Galaxy S24","methods":["scrapybara","playwright","puppeteer"]}'
\`\`\`

### Test Scenarios
1. **Basic Comparison**: iPhone vs Samsung
2. **Laptop Comparison**: MacBook vs ThinkPad
3. **Error Handling**: Invalid product names
4. **Fallback Testing**: Disable browser automation

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting

### Adding New Scrapers
1. Create new scraper in `lib/` directory
2. Implement the `scrapeProduct(productName: string)` method
3. Add error handling and logging
4. Update the API route to include your scraper

## 📝 API Reference

### POST /api/compare-products

**Request Body:**
\`\`\`json
{
  "product1": "iPhone 15 Pro",
  "product2": "Samsung Galaxy S24 Ultra",
  "methods": ["scrapybara", "playwright", "puppeteer"]
}
\`\`\`

**Response:**
\`\`\`json
{
  "product1": {
    "name": "iPhone 15 Pro",
    "price": "$999.99",
    "rating": "4.5/5",
    "features": ["Advanced camera", "A17 Pro chip"],
    "specifications": {...}
  },
  "product2": {...},
  "comparison": "Detailed AI comparison...",
  "readme": "# Product Comparison Report...",
  "logs": [...]
}
\`\`\`

## 🔮 Future Enhancements

### Planned Features
- **Real-time WebSocket Updates**: Live progress streaming
- **Database Integration**: Supabase for caching and history
- **More Data Sources**: Additional e-commerce APIs
- **Export Options**: PDF, CSV, and JSON formats
- **Batch Processing**: Compare multiple products simultaneously
- **API Access**: RESTful API for programmatic access

### Performance Improvements
- **Parallel Processing**: Concurrent scraping for faster results
- **Intelligent Caching**: Smart caching with Upstash Redis
- **Load Balancing**: Distribute scraping across multiple instances
- **Rate Limit Optimization**: Adaptive rate limiting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Issues**: Report bugs via [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: Refer to this README and inline code comments
- **Community**: Join discussions in [GitHub Discussions](https://github.com/your-repo/discussions)

### Troubleshooting

#### Common Issues

**"OpenAI API key not configured"**
- Ensure `.env` file exists with `OPENAI_API_KEY=your_key`
- Restart the development server after adding the key

**Browser automation fails**
- Install Playwright: `npx playwright install chromium`
- The system will fall back to AI simulation if browsers fail

**No comparison results**
- Check your internet connection
- Verify the OpenAI API key is valid
- Review logs in the Monitoring tab

#### Debug Mode
Enable detailed logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel AI SDK**: For seamless AI integration
- **shadcn/ui**: For beautiful UI components
- **Playwright & Puppeteer**: For browser automation capabilities
- **OpenAI**: For powerful AI analysis capabilities

---

**Built with ❤️ using Next.js, TypeScript, and the AI SDK**

*Ready to compare products intelligently? Get started in under 5 minutes!* 🚀
