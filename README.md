# Shareholder Management System

A modern, full-featured application for managing shareholders, equity shares, installment plans, and payment tracking. Built with the latest web technologies for speed, scalability, and a premium user experience.

> [!IMPORTANT] > **Live Demo & Data Persistence**
>
> This application uses a local **JSON file-based database** (`data/shareholders.json`, etc.) for simplicity.
>
> - **Live Preview**: [https://shareholdermanager.vercel.app/](https://shareholdermanager.vercel.app/)
> - **Limitation**: In the live serverless environment (Vercel), file writes are **temporary**. Any data you add or edit will behave correctly in the UI but **will not persist** after the server restarts or redeploys.
> - **For Full Functionality**: Please clone the repository and run it **locally** (`npm run dev`). Persistent data storage works perfectly in the local environment.

## 🚀 Key Features

- **Shareholder Management**:

  - Add, view, and list shareholders.
  - Search/Filter by email or status.
  - Comprehensive profile views.

- **Share Configuration**:

  - Flexible installment plans: **Monthly**, **Quarterly**, **Yearly**, and **Custom**.
  - Customizable durations and payment modes.
  - Automatic installment schedule generation.

- **Financial & Payment Tracking**:

  - **Dashboard Analytics**: Real-time overview of Total Paid, Expected, and Due amounts.
  - **Payment Processing**: Record full or partial payments against specific installments.
  - **Status Tracking**: Visual indicators for Paid, Pending, Partial, and Overdue statuses.
  - **Payment Preview**: See balance updates before confirming payments.

- **Premium UI/UX**:

  - **Dark Mode**: Fully implemented dark theme for all pages and components.
  - **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
  - **Modern Aesthetics**: Glassmorphism effects, smooth transitions, and polished components.

- **Data Export**:
  - **Excel Export**: Download detailed reports including shareholder info, share configurations, payment history, and calculated statistics (Total Paid, Outstanding, Completion %).

## 🛠️ Technology Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**:
  - `xlsx` for Excel generation
  - `date-fns` for date manipulation
  - `react-hot-toast` for notifications

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/shareholder-management.git
    cd shareholder-management
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Cards, Tables, Modals, etc.).
- `src/hooks`: Custom React hooks for shared logic (e.g., `useDebounce`, `useShareholderData`).
- `src/services`: API service modules for centralized data fetching (`shareholderService`, `shareService`).
- `src/stores`: Global state management using Zustand (ShareStore, ShareholderStore).
- `src/utils`: Helper functions for dates, calculations, and Excel export logic.

## 📄 License

This project is licensed under the MIT License.
