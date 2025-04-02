# Restaurant Website

A comprehensive restaurant management platform that allows restaurant owners to create profiles, manage menus, and interact with customers.

## Features

- **Restaurant Profile Management**
  - Create and edit restaurant profiles
  - Upload restaurant images
  - Manage restaurant details (hours, location, etc.)

- **Menu Management**
  - Add, edit, and delete menu items
  - Upload menu item images
  - Categorize menu items
  - Toggle item availability

- **Firebase Integration**
  - Firestore database for data storage
  - Firebase Storage for image management
  - Authentication with Clerk

## Tech Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - Framer Motion for animations

- **Backend**
  - Java Spring Boot (API endpoints)
  - Firebase Firestore (database)
  - Firebase Storage (image storage)

- **Authentication**
  - Clerk Authentication

## Project Structure

```
restaurant-website/
├── public/                  # Public assets
├── src/
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── restaurant/      # Restaurant-specific components
│   │   │   ├── menu/        # Menu management components
│   │   │   └── ...
│   │   └── ...
│   ├── config/              # Configuration files
│   ├── context/             # React context providers
│   ├── utils/               # Utility functions
│   ├── App.js               # Main App component
│   └── index.js             # Entry point
├── .env.example             # Example environment variables
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Clerk account
- Java Development Kit (JDK) for backend

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/restaurant-website.git
   cd restaurant-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase and Clerk credentials:
   ```
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_API_BASE_URL=http://localhost:8081
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database and Storage
3. Set up authentication methods
4. Add your web app to the Firebase project
5. Copy the configuration to your `.env.local` file

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if true;
      
      match /menuItems/{menuItemId} {
        allow read: if true;
        allow write: if true;
      }
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /restaurants/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## Deployment

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

### Backend Deployment

The Java Spring Boot backend can be deployed to any Java-compatible hosting service like:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Clerk](https://clerk.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
