# ☁️ Cloud Cost Monitoring Dashboard

A responsive multi-cloud cost monitoring dashboard designed to help users analyze cloud spending, track budgets, monitor services, identify alerts, and discover potential cost-saving opportunities across AWS, Google Cloud, and Microsoft Azure.

## 🚀 Live Demo

👉 [View Live Demo](https://cloud-cost-monitorin-bll3.bolt.host)

---

## 📌 Project Overview

Cloud Cost Monitoring Dashboard is a web-based application that provides a centralized view of cloud expenditure across multiple cloud providers.

The dashboard helps users:

- Monitor cloud spending
- Track monthly budgets
- Analyze service-wise costs
- Identify cost alerts
- View cloud spending trends
- Discover potential cost optimization opportunities

The project is designed as a portfolio and educational Cloud Computing application.

---

## 🚀 Features

- 📊 Cloud spending overview dashboard
- ☁️ AWS, Google Cloud, and Azure cost monitoring
- 💰 Monthly spending and budget tracking
- 📈 Cost trend visualization
- 🔔 Cloud cost alerts
- 💡 Cost optimization recommendations
- 🖥️ Service-wise cost analysis
- 🔎 Cloud provider filtering
- 📱 Responsive dashboard interface
- 📊 Budget utilization monitoring
- 💵 Potential savings analysis

---

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- JavaScript / TypeScript
- Lucide React
- Git
- GitHub

---

## 📸 Screenshots

### Dashboard Overview

![Dashboard Overview](Screenshots/dashboard-overview.png)

### Services Monitoring

![Services Monitoring](Screenshots/services.png)

### Budget Tracking

![Budget Tracking](Screenshots/budget-tracking.png)

### Cost Alerts

![Cost Alerts](Screenshots/alerts.png)

### Cost Optimization Recommendations

![Cost Optimization Recommendations](Screenshots/recommendations.png)

---

## 📊 Dashboard Modules

### 1. Overview

The Overview module provides a summary of cloud expenditure.

It displays:

- Current month spending
- Projected month-end cost
- Budget utilization
- Potential savings
- Active alerts
- Cloud spending trends
- Spending by category
- Spending by cloud provider

### 2. Services

The Services module provides service-level cost information across cloud providers.

It displays:

- Service name
- Cloud provider
- Service category
- Service status
- Month-to-date spending
- Spending trend
- Budget utilization

### 3. Budget Tracking

The Budget Tracking module allows users to monitor allocated cloud budgets.

It provides:

- Total budget
- Amount spent
- Remaining budget
- Budget utilization
- Individual service budgets
- Budget status

### 4. Alerts

The Alerts module identifies potential cloud cost issues.

It can display:

- Budget warnings
- Unused resources
- Cost anomalies
- High-cost services
- Resource utilization warnings

### 5. Recommendations

The Recommendations module provides potential cloud cost optimization opportunities.

Examples include:

- Right-sizing compute resources
- Removing idle resources
- Optimizing storage
- Reducing unnecessary network costs
- Optimizing cloud services

Recommendations can include estimated monthly savings.

---

## 🎯 Project Objective

The objective of this project is to provide a centralized dashboard for monitoring and analyzing cloud expenditure across multiple cloud providers.

The dashboard helps users understand their cloud spending, track budgets, monitor individual services, identify cost alerts, and discover potential optimization opportunities.

---

## 🏗️ Architecture

```text
                         User
                           │
                           ▼
                React Web Application
                           │
                           ▼
                  Dashboard Interface
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Dashboard Modules            Supabase
              │                         │
              │                         ▼
              │                   Cloud Cost Data
              │                         │
              └────────────┬────────────┘
                           ▼
                    Cost Analytics
                           │
                           ▼
               Alerts & Recommendations
                           │
                           ▼
                     User Dashboard

📁 Project Structure
cloud-cost-monitoring-dashboard/
│
├── .bolt/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase.ts
│   └── ...
│
├── supabase/
│   └── migrations/
│
├── Screenshots/
│   ├── dashboard-overview.png
│   ├── services.png
│   ├── budget-tracking.png
│   ├── alerts.png
│   └── recommendations.png
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md

💻 Installation & Setup
Follow the steps below to run the project locally.
1. Prerequisites
Make sure the following software is installed on your system:
- Node.js
- npm
- Git
Check Node.js:
node --version

Check npm:
npm --version

Check Git:
git --version

2. Clone the Repository
Clone the GitHub repository:
git clone https://github.com/Munitilak/cloud-cost-monitoring-dashboard.git

Move into the project directory:
cd cloud-cost-monitoring-dashboard

3. Install Dependencies
Install all required project dependencies:
npm install

This installs the packages required to run and build the application.
4. Configure Supabase
This project uses Supabase for its backend/data layer.
Create a file named:
.env

in the root directory of the project.
Add the following variables:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Get the Supabase Project URL
Open your Supabase project and go to the API settings.
Copy your:
Project URL

It will look similar to:
https://your-project-id.supabase.co

Add it to:
VITE_SUPABASE_URL=your_project_url

Get the Supabase Key
From the same Supabase API settings, copy the project's:
Publishable key / Anonymous key

Add it to:
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key

Example
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here

⚠️ Security
Do not upload your .env file to GitHub.
Never commit:
- Supabase service-role keys
- Secret keys
- Database passwords
- Private API keys
- Other sensitive credentials
Only use the public/publishable/anonymous key required by the frontend.
5. Start the Development Server
Run:
npm run dev

Vite will start the development server.
Open the local URL shown in your terminal.
Normally it will be:
http://localhost:5173

6. Build the Project
To create a production build:
npm run build

The production files will be generated inside:
dist/

7. Preview the Production Build
After creating the production build, run:
npm run preview

This allows you to preview the production version locally.
8. Run Linting
To check the project for linting issues:
npm run lint

9. Run Type Checking
To check TypeScript types:
npm run typecheck

☁️ Deployment
The application can be deployed using platforms that support Vite applications.
Current Live Deployment
The current working deployment is available at:
👉 Cloud Cost Monitoring Dashboard
Vite Deployment Configuration
For a Vite deployment, use:
Framework: Vite
Build Command: npm run build
Output Directory: dist

If deploying to a platform such as Vercel, configure the following environment variables:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

📌 Demo Data
The dashboard currently uses realistic cloud billing/demo data for visualization and demonstration purposes.
It is designed to demonstrate:
- Cloud cost monitoring
- Budget tracking
- Service-level cost analysis
- Cost alerts
- Cost optimization recommendations
The project does not claim direct live billing integration with AWS, Google Cloud, or Microsoft Azure unless those integrations are configured separately.
🔐 Environment Variables
The application expects the following environment variables:
Variable	Description
VITE_SUPABASE_URL	Supabase project URL
VITE_SUPABASE_ANON_KEY	Supabase publishable/anonymous key


Example:
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_publishable_key

Do not publish private credentials in the repository.
🔮 Future Enhancements
Possible future improvements include:
- Live AWS billing API integration
- Google Cloud Billing API integration
- Microsoft Azure Cost Management API integration
- User authentication
- Role-based access control
- Email notifications
- Advanced cost forecasting
- AI-powered cost optimization
- PDF cost reports
- CSV cost reports
- Real-time cloud billing synchronization
- Advanced cloud analytics
📚 Learning Outcomes
This project demonstrates practical experience with:
- Cloud Computing concepts
- Multi-cloud cost monitoring
- React development
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Web application architecture
- Cloud budgeting concepts
- Cost optimization
- Git and GitHub
- Web application deployment
👨‍💻 Author
Muni Tilak
B.Tech CSE | Cloud Computing
GitHub:
https://github.com/Munitilak
📄 License
This project is created for educational and portfolio purposes.

### After pasting

Use this commit message:

```text
Improve README with complete installation guide
