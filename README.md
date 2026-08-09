# Professional Portfolio Website

A full-stack portfolio website for video editors and creative professionals with admin panel for easy content management.

## 🌟 Features

- **Complete Admin Panel** - Manage all content without coding
- **Projects Showcase** - Display your work with detailed information
- **Video Reel** - Embed YouTube/Vimeo videos
- **Services** - List your offerings with pricing
- **Skills & Education** - Professional background
- **Experience** - Work history
- **Certificates** - Display credentials
- **Contact Form** - Professional communication
- **Responsive Design** - Works on all devices
- **Secure Authentication** - Protected admin area

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

### Frontend
- React.js
- React Router
- Axios
- React Icons
- CSS3

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (XAMPP recommended)
- Git

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-website.git
cd portfolio-website
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 3. Setup Database

1. Start XAMPP and enable MySQL
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database: `portfolio_db`
4. Import: `database/portfolio_db.sql`
5. Import: `database/add_new_features.sql`
6. (Optional) Import: `database/enhance_projects.sql`

### 4. Setup Frontend

```bash
cd frontend
npm install
```

### 5. Start the Application

**Backend:**
```bash
cd backend
node server.js
```

**Frontend (in new terminal):**
```bash
cd frontend
npm start
```

## 🔐 Default Admin Login

- **Username:** admin
- **Password:** admin123

**⚠️ Change these credentials after first login!**

## 📁 Project Structure

```
portfolio-website/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication & file upload
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   └── server.js       # Main server file
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Navbar, Footer, etc.
│       ├── pages/      # All pages
│       ├── config/     # API configuration
│       └── App.js
├── database/           # SQL files
└── README.md
```

## 🎯 Usage

### Admin Panel

1. Login at: http://localhost:3000/admin/login
2. Access dashboard to manage:
   - Profile information
   - Projects
   - Skills
   - Education
   - Experience
   - Certificates
   - Video Reel
   - Services
   - Contact messages

### Public Pages

- Home: `/`
- About: `/about`
- Projects: `/projects`
- Skills: `/skills`
- Education: `/education`
- Experience: `/experience`
- Certificates: `/certificates`
- Video Reel: `/video-reel`
- Services: `/services`
- Contact: `/contact`

## 🔧 Customization

### Update Your Information

1. Login to admin panel
2. Go to "Manage Profile"
3. Update your details
4. Upload profile photo

### Add Your Projects

1. Go to "Manage Projects"
2. Click "Add Project"
3. Fill in details and upload images
4. Mark important projects as "Featured"

### Add Videos

1. Go to "Manage Video Reel"
2. Add YouTube or Vimeo video URLs
3. Categorize your videos

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected admin routes
- Input validation
- SQL injection prevention

## 🌐 Deployment

### Deploy to Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Deploy backend and frontend separately

### Deploy to Vercel (Frontend)

1. Push to GitHub
2. Import project in Vercel
3. Deploy

### Deploy Database

Use services like:
- ClearDB (Heroku)
- PlanetScale
- AWS RDS

## 📝 Environment Variables

Create `.env` file with:

```env
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=portfolio_db
JWT_SECRET=your_secret_key_here
```

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Diro Uchure**
- Email: diro.uchure@gmail.com
- Phone: +251940672637
- GitHub: [@Dirouchure](https://github.com/Dirouchure)

## 🙏 Acknowledgments

- Built with passion for video editing professionals
- Designed for easy content management
- Focus on showcasing creative work

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: diro.uchure@gmail.com

---

Made with ❤️ by Diro Uchure
