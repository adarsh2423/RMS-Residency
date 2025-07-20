# ComfortStay PG - Accommodation Website

A modern, responsive website for paying guest accommodations built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Responsive Design**: Works seamlessly on all devices from mobile to 4K desktop
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Gallery**: Modal galleries with keyboard navigation for branch photos
- **Real-time Availability**: Dynamic room availability tables
- **Google Maps Integration**: Embedded maps for easy location finding
- **Firebase Authentication**: Secure admin login system
- **Admin Dashboard**: Protected admin area for data management
- **Smooth Scrolling**: Navigation with smooth scroll to sections

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (for authentication and database)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your config from Project Settings > General > Your apps

4. Environment Setup:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Branches.tsx
│   ├── Gallery.tsx
│   ├── Availability.tsx
│   ├── FindUs.tsx
│   ├── Footer.tsx
│   └── AdminLoginModal.tsx
├── admin/               # Admin-specific components
│   └── AdminPage.tsx
├── utils/               # Utility functions and configs
│   └── firebase.ts
├── data/                # Mock data and types
│   └── mockData.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx              # Main application component
```

## Features Overview

### Homepage Sections

1. **Hero Section**: Full-width banner with call-to-action buttons
2. **About Us**: Company information and values
3. **Branches**: Interactive branch cards with photo galleries
4. **Availability**: Real-time room availability tables
5. **Find Us**: Google Maps integration for each location
6. **Footer**: Contact information and quick links

### Admin Features

- Secure authentication with Firebase Auth
- Protected admin dashboard
- Real-time authentication state management
- Placeholder for data management features

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Optimized layouts for all screen sizes
- Touch-friendly interactions

## Customization

### Adding New Branches

Edit `src/data/mockData.ts` to add or modify branch information:

```typescript
{
  id: 'branch-3',
  name: 'New Branch',
  description: 'Branch description...',
  mainImage: 'image-url',
  galleryImages: ['url1', 'url2', 'url3'],
  mapEmbedUrl: 'google-maps-embed-url',
  rooms: [...]
}
```

### Styling

The project uses Tailwind CSS for styling. Key color scheme:
- Primary: Blue (#2563eb)
- Secondary: Teal (#0d9488)
- Accent: Orange (#ea580c)

### Firebase Configuration

Update `src/utils/firebase.ts` to modify Firebase services or add new ones.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the project
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure Firebase hosting rules if needed

## Future Enhancements

- [ ] Firestore integration for dynamic data
- [ ] Online booking system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced admin features
- [ ] Multi-language support
- [ ] PWA capabilities

## Support

For issues and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.