# Mess Manager Pro

A free, modern, and easy-to-use mess management system for hostels and mess facilities. Built with HTML, CSS, Bootstrap, and Firebase.

## Features

- User Authentication (Login/Register)
- Role-based Access Control (Admin/Manager/Member)
- Meal Management
- Expense Tracking
- Member Management
- Real-time Updates
- Responsive Design
- Mobile-friendly Interface

## Technology Stack

- HTML5
- CSS3
- Bootstrap 5
- Firebase (Authentication & Realtime Database)
- Font Awesome Icons

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/mess-manager-pro.git
   cd mess-manager-pro
   ```

2. **Set Up Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Get your Firebase configuration

3. **Configure Firebase**
   - Open `js/config.js`
   - Replace the Firebase configuration with your own:
     ```javascript
     const firebaseConfig = {
         apiKey: "your-api-key",
         authDomain: "your-auth-domain",
         projectId: "your-project-id",
         storageBucket: "your-storage-bucket",
         messagingSenderId: "your-messaging-sender-id",
         appId: "your-app-id"
     };
     ```

4. **Deploy to GitHub Pages**
   - Push your code to GitHub
   - Go to repository Settings > Pages
   - Select the main branch as the source
   - Save the changes

## Firebase Database Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "mess": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    }
  }
}
```

## Project Structure

```
mess-manager-pro/
├── index.html
├── dashboard.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── auth.js
│   └── app.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Bootstrap for the UI framework
- Firebase for the backend services
- Font Awesome for the icons 