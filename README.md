[🇰🇷 한국어 (Korean)](./README.ko.md)

# Cafe Lua

**Cafe Lua** is a virtual space project themed around a quiet tea house in the forest. It provides visitors with relaxation and warm stories, offering an immersive experience through various interactive elements.

## 🌿 Introduction

This project is a web application built with React and Vite, featuring the following:

*   **Immersive Intro**: Invites you to the world of Cafe Lua with backgrounds that change according to time and weather.
*   **Lounge Space**: The main area where you can enjoy the atmosphere of Cafe Lua with relaxing music.
*   **Responsive Design**: Provides an optimized experience on various devices.
*   **Multilingual Support (Planned)**: Cafe Lua's stories will be delivered in various languages.

## 🚀 Key Features

*   **Real-time Environment Reflection**: Background changes reflecting the user's actual location-based weather and time using OpenWeather API (Coming Soon).
*   **Background Music (BGM)**: BGM playback and control tailored to each space, such as the intro and lounge.
*   **Character Interaction**: Conversation and interaction with Cafe Lua's mascot 'Alpha' (In Development).

## 🛠️ Tech Stack

*   **Framework**: React, Vite
*   **Language**: TypeScript
*   **Styling**: CSS Modules (or Styled Components)
*   **State Management**: (TBD)
*   **Deployment**: (TBD)

## 📂 Project Structure

```
public-home/
├── public/             # Static resources (images, audio, etc.)
├── src/
│   ├── components/     # UI Components
│   ├── assets/         # Assets imported within source code
│   ├── styles/         # Global styles and theme settings
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry Point
└── ...
```

## 📝 Changelog

### v0.1.1 (2025-11-30)
- **Features & Improvements**:
    - **Weather API Integration**: Added functionality to fetch real-time weather information and reflect it in the background and environmental elements.
    - **BGM System**: Added auto-play and control UI for background music in Lounge and Intro pages.
    - **Lounge Menu**: Added menu button UI in the Lounge screen to access main features (linked to Under Construction page).
- **UI/UX Improvements**:
    - **Under Construction Page Redesign**:
        - Changed layout of text and character image (Image on left, Text on right).
        - Fixed character image size (100px) and updated style (removed border, natural placement).
        - Adjusted position of 'Back to Lounge' button (aligned to bottom right) and improved style.
    - **Intro Page Improvement**: Enhanced sharing experience by applying Open Graph meta tags and cover image.

### v0.1.0 (2025-11-20)
- **Initial Release**:
    - Project basic structure setup (React + Vite + TypeScript).
    - Intro page implementation (automatic background image transition by time).
    - Basic Lounge page implementation.
    - Basic routing setup.

## 🤝 Contributing

This project is currently being developed as a personal project. Contribution guidelines will be provided in the future. Please report bugs or suggest features via Issues.

## 📄 License

(License information to be added)
