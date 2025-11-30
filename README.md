[🇰🇷 한국어](./README.ko.md)

# Cafe Lua

**Cafe Lua** is a virtual space project themed around a tranquil teahouse in the forest. It offers visitors a relaxing retreat and warm stories, providing an immersive experience through various interactive elements.

## 🌿 Project Introduction

This project is a web application built with React and Vite, featuring the following characteristics:

*   **Immersive Intro**: Invites you into the world of Cafe Lua with backgrounds that change according to the time of day and weather.
*   **Lounge Space**: The main area where you can enjoy the atmosphere of Cafe Lua with comfortable music.
*   **Responsive Design**: Provides an optimized experience across various devices.
*   **Multilingual Support**: Offers multilingual support, including Korean and English, using i18next.

## 🚀 Key Features

*   **Real-time Environment Reflection**: Reflects the user's actual location-based weather and time zone in the background (in preparation).
*   **Background Music (BGM)**: BGM playback and control features suitable for each space, such as the intro and lounge.
*   **Character Interaction**: Conversation and interaction with Cafe Lua's mascot, 'Alpha' (in development).

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
│   ├── components/     # UI components
│   ├── assets/         # Assets imported within the source code
│   ├── styles/         # Global styles and theme settings
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry Point
└── ...
```

## 📝 Changelog

### v0.1.1 (2025-11-30)
- **Features & Improvements**:
    - **Weather API Integration**: Added functionality to fetch real-time weather information and reflect it in the background and environmental elements.
    - **BGM System**: Added automatic background music playback and control UI to the lounge and intro pages.
    - **Lounge Menu**: Added a menu button UI to the lounge screen for accessing key features (linked to under construction page).
- **UI/UX Enhancements**:
    - **Under Construction Page Redesign**:
        - Changed the layout of text and character images (image on the left, text on the right).
        - Fixed character image size (100px) and modified styles (removed border, natural placement).
        - Adjusted the 'Return to Lounge' button position (aligned to the bottom right) and improved its style.
    - **Intro Page Improvements**: Enhanced sharing experience by applying Open Graph meta tags and a cover image.

### v0.1.0 (2025-11-20)
- **Initial Release**:
    - Set up the basic project structure (React + Vite + TypeScript).
    - Implemented the intro page (automatic background image change by time of day).
    - Basic implementation of the lounge page.
    - Set up basic routing.

## 🤝 Contributing

This project is currently being developed as a personal project, and a contribution guide will be prepared in the future. Please leave bug reports or feature suggestions through Issues.

## 📄 License

(License information to be added)
