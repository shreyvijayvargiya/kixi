# kixr

A powerful platform for creating stunning animated gradients and accessing premium React, Next.js, and Vite code templates. Build beautiful websites faster with production-ready components and templates.

## 🚀 Features

### Animated Gradient Generator
- **Real-Time Preview**: See your gradient animations instantly as you customize them
- **Customizable Colors**: Create gradients with unlimited color combinations
- **Multiple Animation Types**: Choose from various animation styles and effects
- **AI-Powered Generation**: Generate perfect gradients from simple text prompts
- **Multiple Export Formats**: Export as PNG, SVG, GIF, MP4, or React code
- **Production-Ready Code**: Get clean, copy-paste React code for your projects

### Template Marketplace
- **Landing Pages**: Ready-to-use landing page templates
- **Portfolio Templates**: Beautiful portfolio designs for developers and designers
- **AI Templates**: AI-generated template designs
- **Content Templates**: Pre-built content sections
- **Payment & Forms**: Integrated payment and form components
- **React, Next.js & Vite**: Templates available in multiple frameworks

### Additional Features
- **Google Authentication**: Secure login with Google
- **Unlimited Projects**: Create and save unlimited gradient projects
- **Template Search**: Find templates quickly with search functionality
- **Category Filtering**: Browse templates by category
- **Source Code Access**: View and download complete source code
- **GitHub Integration**: Push code directly to your GitHub repository (coming soon)

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth (Google)
- **Database**: Firebase Firestore
- **AI Integration**: Google AI SDK, Mistral AI
- **Payment**: Lemon Squeezy, Polar
- **Icons**: Lucide React, React Icons
- **Code Editor**: TipTap
- **Image Processing**: FFmpeg, html-to-image

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/shreyvijayvargiya/kixi.git
cd kixr
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add your configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_key
MISTRAL_API_KEY=your_mistral_key

# Payment Configuration
LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_key
POLAR_API_KEY=your_polar_key

# Email Configuration
RESEND_API_KEY=your_resend_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kixr/
├── app/                          # Application components
│   ├── Apps/                     # Main app components
│   │   ├── AnimatedGradientGenerator.jsx
│   │   ├── IconSelectorModal.jsx
│   │   └── hooks/                # Custom hooks
│   └── Home/                     # Home page components
│       └── components/            # Landing page sections
├── components/                    # Reusable components
│   ├── GoogleLoginButton.jsx
│   ├── SubscriptionModal.jsx
│   └── Sidebar.jsx
├── content/                      # Content files
│   └── blogs/                    # Blog posts
├── lib/                          # Utilities and configurations
│   ├── firebase.js               # Firebase configuration
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
├── modules/                      # Feature modules
│   ├── Body/
│   └── Navbar.jsx
├── pages/                        # Next.js pages
│   ├── api/                      # API routes
│   ├── app.js                    # Main app page
│   ├── pricing.js                # Pricing page
│   └── account.js                # Account page
├── public/                       # Static assets
├── redux/                        # Redux store and slices
├── styles/                       # Global styles
└── package.json                  # Dependencies
```

## 🎯 Usage

### Creating Animated Gradients

1. Navigate to `/app` or click "Get Started"
2. Customize your gradient:
   - Choose colors
   - Adjust animation settings
   - Preview in real-time
3. Export in your preferred format:
   - PNG, SVG, GIF, MP4 for images/videos
   - React code for direct integration

### Using Templates

1. Browse templates at `/templates`
2. Search or filter by category
3. View source code or download repository
4. Copy components directly into your project

### AI-Powered Generation

1. Use the AI assistant to generate gradients from text prompts
2. Describe your desired gradient
3. Get instant results ready to export

## 💳 Pricing

- **Free**: Basic gradient creation, standard exports, community support
- **PRO ($99/year)**: All templates access, unlimited projects, AI-powered generation, priority support, all export formats

## 🔐 Authentication

The app uses Google OAuth for authentication. Users can sign in with their Google account to:
- Save projects
- Access premium features
- Manage subscriptions

## 🚧 Roadmap

- [ ] Direct GitHub repository push
- [ ] AI code editor
- [ ] More premium templates
- [ ] Comprehensive documentation
- [ ] Template marketplace expansion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Shrey Vijayvargiya**

- Website: [gettemplate.website](https://www.gettemplate.website)
- GitHub: [@shreyvijayvargiya](https://github.com/shreyvijayvargiya)

## 🙏 Acknowledgments

- Built with love for developers and designers
- Inspired by the need for better gradient creation tools
- Powered by modern web technologies

---

Made with ❤️ by the kixr team
