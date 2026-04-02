# NexLearn

A futuristic, high-performance Learning Platform and Multiple Choice Question (MCQ) App built with Next.js 16, Tailwind CSS v4, and Zustand.

## 🚀 Features

- **Secure Authentication:** JWT-based authentication flow with OTP verification.
- **Onboarding Flow:** Seamless user data collection (Name, Email, Qualification, Profile Image) for both new and existing users.
- **Dynamic MCQ Exams:** Live exams with countdown timers, powered by a live API backend.
- **State Management:** Fast and predictable global state management utilizing `Zustand`.
- **Modern UI/UX:** 
  - Styled with the new **Tailwind CSS v4** engine.
  - Custom brand colors, smooth gradients (e.g., `#1C3141` to `#487EA7`).
  - Beautiful typography featuring **Space Grotesk** and **Inter**.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Flowbite React](https://flowbite-react.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client:** [Axios](https://axios-http.com/) (with JWT interceptors)
- **Language:** TypeScript

## 📦 Getting Started

### Prerequisites

Make sure you have Node.js (v20 or newer) and npm/yarn/pnpm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nexlearn.git
   cd nexlearn
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables (create a `.env.local` file):
   ```bash
   # Add your API base URLs and other keys here
   NEXT_PUBLIC_API_BASE_URL=your_api_url_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

```text
nexlearn/
├── app/                  # Next.js App Router pages and layouts
│   ├── globals.css       # Tailwind v4 configuration and global styles
│   ├── instructions/     # Exam instructions page
│   ├── mcq/              # Main MCQ exam page
│   ├── result/           # Exam result and summary page
│   ├── layout.tsx        # Root layout for the application
│   └── page.tsx          # Main landing/login onboarding page
├── components/           # Reusable React components
│   ├── AuthGuard.tsx     # Route protection component
│   ├── Header.tsx        # Application header
│   ├── Modal.tsx         # Reusable modal for UI dialogues
│   └── Paragraph.tsx     # Animated text components
├── lib/                  # Application core logic
│   ├── api.ts            # Axios instances and API services
│   └── stores/           # Zustand state management stores
├── public/               # Static assets & PWA manifest icons
└── README.md             # Project documentation
```

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to catch errors.

## 🎨 Design System

NexLearn's design is driven by a deep dark-mode aesthetic. 
- **Typography:** Headings use `Space Grotesk` for a futuristic feel, while body text uses `Inter` for maximum legibility.
- **Colors:** Deep blues (`#1C3141` to `#487EA7`) and polished gradients with distinct background illustrations to keep the interface dynamic.

---
*Built with ❤️ for a futuristic learning experience.*