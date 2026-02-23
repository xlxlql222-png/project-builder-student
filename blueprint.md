# Blueprint: Dog or Cat Face Classifier 🐶🐱

## Overview
This project is a fun, interactive web application that uses a Teachable Machine image model to classify whether a person's face resembles a dog (강아지상) or a cat (고양이상). Users can upload their photos to get an instant prediction with a modern and engaging UI.

## Features
- **Image Upload & Preview:** Users can easily upload their photos and see a preview before analysis.
- **Teachable Machine Integration:** Leverages a pre-trained image classification model for accurate "Dog vs. Cat" face typing.
- **Interactive Results:** Displays classification results with progress bars and fun emoji-based feedback.
- **Modern & Responsive UI:** A sleek, mobile-friendly design with glassmorphism effects, vibrant gradients, and smooth animations.
- **Dark/Light Mode:** Full support for theme switching to suit user preferences.

## Design Specifications
- **Typography:** Expressive fonts ('Noto Sans KR' and 'Poppins') for a premium feel.
- **Color Palette:** A vibrant mix of purples (`#8b5cf6`), pinks (`#ec4899`), and blues for a modern tech aesthetic.
- **Visual Effects:** Multi-layered drop shadows, subtle noise textures (via SVG filter), and glassmorphism.
- **Animations:** Smooth transitions, spinners, and progress bar fills.

## Implementation Details
- **Tech Stack:** Vanilla HTML5, CSS3 (Modern Baseline), JavaScript (ES Modules), TensorFlow.js, Teachable Machine Image Library.
- **Model Loading:** The application loads a Teachable Machine model from a provided URL.
- **Image Processing:** Uses `FileReader` for local image preview and passes the `HTMLImageElement` directly to the model's `predict` method.

## How to use your own model
In `main.js`, update the `MODEL_URL` constant with your Teachable Machine export link:
```javascript
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";
```

## Status: Complete ✅
- [x] Modern UI Structure
- [x] Responsive CSS Styling
- [x] Image Upload & Preview Logic
- [x] AI Model Integration & Prediction Display
- [x] Theme Switching Support
