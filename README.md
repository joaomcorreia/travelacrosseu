# 🌍 Travel Across EU

A modern full-stack travel website built with Django REST API backend and Next.js frontend, featuring AI-powered content generation, multilingual support, and a comprehensive CMS.

## ✨ Features

### 🎯 Core Features
- **Full-Stack Architecture**: Django REST API + Next.js frontend
- **Multilingual Support**: English, Spanish, French, Dutch, Portuguese
- **CMS Integration**: Comprehensive content management system
- **AI-Powered Content**: OpenAI integration for travel content generation
- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **Image Optimization**: Automated image handling and optimization
- **SEO Ready**: Dynamic metadata, sitemaps, and structured data

### 🏛️ Content Management
- **Dynamic Pages**: CMS-driven page creation and management
- **Blog System**: Full-featured blog with categories and translations
- **Destination Management**: Country → City → Destination hierarchy
- **Media Library**: Image upload and management system
- **Hero Sliders**: Multi-image carousels for pages and destinations
- **Modular Sections**: Flexible page sections with text, images, and CTAs

### 🎨 User Experience
- **Interactive Hero Sections**: Auto-cycling image sliders with hover controls
- **Alternating Layouts**: Dynamic image positioning for visual variety
- **Gradient Backgrounds**: Soft, modern color schemes with geometric shapes
- **Smooth Animations**: Hover effects and transitions
- **Dark Mode Support**: Complete dark/light theme system

## 🚀 Tech Stack

### Backend
- **Django 5.1.14**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (production-ready for PostgreSQL)
- **OpenAI API**: AI content generation
- **CORS**: Cross-origin resource sharing

### Frontend
- **Next.js 16.0.3**: React framework with Turbopack
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Hero Icons**: Icon library
- **Image Optimization**: Next.js Image component

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/joaomcorreia/travelacrosseu.git
   cd travelacrosseu
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # macOS/Linux
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start Next.js development server**
   ```bash
   npm run dev
   ```

## 🌐 Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/

## 📁 Project Structure

```
travelacrosseu/
├── backend/                 # Django settings
├── cms/                     # CMS app (pages, blog, destinations)
├── core/                    # Core app (travel pages, AI)
├── frontend/                # Next.js application
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API clients
│   └── public/              # Static assets
├── media/                   # Django media files
├── templates/               # Django templates
├── scripts/                 # Development scripts
└── docs/                    # Documentation
```

## 🎨 Key Components

### Frontend Components
- **EnhancedHeroSection**: Interactive 3-image slider with auto-cycling
- **CategoriesSection**: Travel category showcase with local images
- **SectionRenderer**: Dynamic CMS content rendering with alternating layouts
- **DestinationCard**: Country and destination display components
- **BlogSystem**: Full blog functionality with categories

### Backend Models
- **PageTranslation**: Multilingual page content
- **Country/City/Destination**: Geographic hierarchy
- **BlogPost/BlogCategory**: Blog system
- **MediaFile**: File upload management
- **HomepageCategory**: Featured travel categories

## 🔧 Configuration

### Environment Variables
Create `.env` file in the project root:
```env
DEBUG=True
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key  # Optional
```

### Next.js Configuration
The `next.config.ts` includes:
- Image domain configuration
- Internationalization setup
- Static export options

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:
- Phase-by-phase development guides
- Model schemas and API documentation
- Deployment instructions
- Feature implementation guides

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure production database (PostgreSQL)
- [ ] Set up static file serving
- [ ] Configure domain in Next.js
- [ ] Set up SSL certificates
- [ ] Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For AI content generation capabilities
- **Next.js Team**: For the excellent React framework
- **Django Team**: For the robust web framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Heroicons**: For the beautiful icon library

## 📞 Contact

- **GitHub**: [@joaomcorreia](https://github.com/joaomcorreia)
- **Repository**: [travelacrosseu](https://github.com/joaomcorreia/travelacrosseu)

---

**Travel Across EU** - Discover Europe, one destination at a time. 🇪🇺 ✈️