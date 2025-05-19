# Workout Application Structure "REPO"

#### Structure of Developer Documentation:

##### 1. Project Overview

- **Repo** is a workout tracking application that help user's manage and track their workouts easily.
- Core features **(create workout,create routine,view other's workout, track workouts, user progress through calendar streaks, goals)**
- Target platform **(IOS, Android)**

##### 2. Tech Stack

- **Frontend**: React Native (Expo)
- **State Management**: (Redux)
- **Backend / DB**: Firebase (Authentication, Firestore, Firestore Database)
- **Design**: Figma

##### 3. Folder Structure

- **app** - Contains the core UI layout and top-level application structure (e.g., pages, routes, or root components).
- **assets** -Stores static files such as images, icons, fonts, audio, or other media resources.
- **components** - Houses reusable UI components (e.g., Button, Card, Modal) to ensure consistency and reduce duplication.
- **constants** - Holds immutable configuration values (e.g., API endpoints, theme colors, error messages) used across the application.
- **custom-types** - Defines TypeScript interfaces, types, or enums for type safety and shared type definitions.
- **hooks** - Contains custom React hooks (e.g., useFetch, useLocalStorage) for reusable stateful logic.
- **redux** - Manages global state using Redux (e.g., actions, reducers, store configuration).
- **services** - Handles API calls, external service integrations (e.g., program-service.ts), and business logic.
- **utils** - Provides utility/helper functions (e.g., date formatting, validation, logging) for shared functionality.

##### 4. Other configs

- **.env** - Stores environment variables such as API keys, secrets, and configuration settings (never committed to version control).
- **APP_DOCUMENTATION** - Contains detailed technical documentation about the application, including architecture, tech stack, and usage guidelines.
- **README** - Provides setup instructions, installation steps, and essential information for running the application locally.

# Workout Application "REPO" Workflow

##### 1. User Registration

Users must register an account to access the app. In future updates, we plan to introduce a Guest Mode that allows limited access without registration.

##### 2. User login

Registered users can log in to access their personalized workout data and settings.

##### 3. Create routine

Users can create custom routines, which are structured plans consisting of specific workouts designed to meet fitness goals..

##### 4. Create program / folder

Users can create programs (or folders) to organize workouts based on type or training objectives (e.g., strength, cardio, HIIT). These act as collections of exercises grouped under a theme.

##### 5. Create Workout

Users can create workouts on the fly for quick sessions without needing to build a full routine or program. Ideal for spontaneous training.

##### 6. Social

The social feature allows users to follow others, view their progress, and check out shared workout routines. It promotes accountability and community engagement.

##### 7. Profile

The Profile section includes the user’s dashboard with personalized analytics, workout streaks, and a calendar view of activity history. Users can track their fitness journey here.
