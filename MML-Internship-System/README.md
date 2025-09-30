# MML-CONCEPT Internship Application System

A professional internship application management system built with Next.js, featuring a Google Forms-like interface for applicants and a comprehensive admin dashboard for reviewing applications.

## 🚀 Features

### For Applicants
- **Clean Application Form**: Google Forms-inspired interface for easy application submission
- **Multiple Role Options**: Apply for Frontend Developer, Backend Developer, or Content Writer positions
- **Comprehensive Fields**: Legal name, email, contact number, resume link, and detailed justification
- **Real-time Validation**: Form validation with helpful error messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### For Administrators
- **Secure Admin Dashboard**: Password-protected access to applicant data
- **Full-Screen Application View**: Detailed view of each application in a full-screen dialog
- **Search & Filter**: Search through applications by name, email, or role
- **Application Statistics**: Overview of total applications and role distribution
- **Export Capabilities**: Easy access to applicant information for further processing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Prisma ORM
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mml-internship-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/mml-internships"
   NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-admin-password"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run database initialization scripts**
   Execute the SQL scripts in the `scripts/` folder to set up initial database structure.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | Yes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin dashboard password | Yes |

### Database Setup

The application uses Prisma with MongoDB. The main model is:

```prisma
model Application {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  legalName    String
  email        String
  contactNumber String
  resumeLink   String
  role         Role
  justification String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  VIDEO_EDITOR
  CONTENT_WRITER
  WEB_DEVELOPER
  GRAPHIC_DESIGNER
}
```

## 📖 Usage

### For Applicants

1. Visit the homepage at `/`
2. Fill out the application form with all required information:
   - Legal Name
   - Email Address
   - Contact Number
   - Resume Link (Google Drive, Dropbox, etc.)
   - Select desired role
   - Write a justification (50-1000 characters)
3. Submit the application
4. Receive confirmation of successful submission

### For Administrators

1. Navigate to `/admin`
2. Enter the admin password when prompted
3. View all applications in the dashboard
4. Use the search functionality to find specific applicants
5. Click on any application card to view full details
6. Use the logout button to secure the session

## 🔌 API Endpoints

### Applications

- `GET /api/applications` - Retrieve all applications
- `POST /api/applications` - Create a new application
- `GET /api/applications/[id]` - Get specific application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application
- `GET /api/applications/stats` - Get application statistics

### Request/Response Examples

**Create Application (POST /api/applications)**
```json
{
  "legalName": "John Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "resumeLink": "https://drive.google.com/file/d/example",
  "role": "WEB_DEVELOPER",
  "justification": "I am passionate about frontend development..."
}
```

## 🎨 Design System

The application uses a professional black and white theme with:

- **Primary Colors**: Black (#000000) and White (#FFFFFF)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Responsive design with mobile-first approach
- **Components**: Consistent shadcn/ui components throughout

## 🔒 Security Features

- **Admin Authentication**: Password-protected admin access
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Sanitization**: Input sanitization to prevent XSS attacks

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/JagTheFriend/MML-Internship-System/blob/main/LICENSE.md) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team
