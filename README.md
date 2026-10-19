# Professional Portfolio Website

A full-stack portfolio website for video editors and creative professionals with admin panel for easy content management.

## 🌟 Features

- **Complete Admin Panel** - Manage all content without coding
- **Projects Showcase** - Display your work with detailed information
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

Create `.env` from the example (default port **5001** — port 5000 is often used by other apps):

```bash
cd backend
copy .env.example .env
```

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

For the frontend, copy `frontend/.env.example` to `frontend/.env` so the app talks to the correct API port.

### 3. Setup Database

**Option A (Automated - 1 command):**
Make sure MySQL is running in XAMPP, then run:
```bash
cd backend
npm run init-db
```

**Option B (Manual via phpMyAdmin):**
1. Start XAMPP and enable MySQL
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database: `portfolio_db`
4. Import: `database/portfolio_db.sql` (now contains the unified, full schema)

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
PORT=5001
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=portfolio_db
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=https://your-frontend-domain.com
```

**Before going live:** change the default admin password, use a long random `JWT_SECRET`, and set `CORS_ORIGIN` to your frontend URL only.

## 📧 Email Notifications (Contact Form)

When someone submits the contact form, messages are always saved to the database. If SMTP is configured, you also receive an email notification and the visitor gets an auto-reply.

Add these to `backend/.env` (see `backend/.env.example`):

```env
MAIL_TO=diro.uchure@gmail.com
MAIL_FROM=your-portfolio@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
MAIL_AUTO_REPLY=true
```

### Gmail setup

1. Enable **2-Step Verification** on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Use that 16-character password as `SMTP_PASS` (not your regular Gmail password)
5. Set `SMTP_USER` to your Gmail address and `MAIL_FROM` to the same or a display address

**Without SMTP configured:** the contact form still works — messages are saved to the database and viewable in Admin → Messages.

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
# portfolio-website
