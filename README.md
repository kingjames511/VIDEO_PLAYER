# 🎬 Custom React Video Player

A modern, fully-featured video player built with React and TypeScript. Upload any video file and enjoy smooth playback with custom controls, synchronized progress tracking, and an elegant dark theme interface.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

- 📁 **File Upload Support** - Drag & drop or click to upload video files
- ⏯️ **Custom Playback Controls** - Play, pause, and seek with precision
- 🎚️ **Interactive Progress Bar** - Click or drag to scrub through video
- 🔊 **Volume Control** - Mute/unmute functionality
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Dark Theme UI** - Modern, eye-friendly interface
- ⚡ **Performance Optimized** - Efficient memory management and cleanup
- 🎯 **Type Safe** - Built with TypeScript for reliability

## 🚀 Demo

![Video Player Demo](https://github.com/kingjames511/VIDEO_PLAYER)

*Upload a video file and start playing with the custom controls*

## 🛠️ Tech Stack

- **Frontend:** React 18+ with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Video API:** HTML5 Video API
- **Build Tool:** Vite (recommended)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser with HTML5 video support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kingjames511/VIDEO_PLAYER.git
   cd VIDEO_PLAYER
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Usage

### Basic Implementation

```jsx
import VideoPlayer from './VideoPlayer';

function App() {
  return (
    <div className="App">
      <VideoPlayer />
    </div>
  );
}
```

### Supported Video Formats

- MP4 (recommended)
- WebM
- OGG
- AVI, MOV, WMV, FLV, MKV

### Key Controls

| Action | Method |
|--------|--------|
| **Upload Video** | Click upload button or drag & drop |
| **Play/Pause** | Spacebar or click play button |
| **Seek** | Click on progress bar |
| **Scrub** | Drag progress bar handle |
| **Mute/Unmute** | Click volume button |

## 🏗️ Project Structure

```
VIDEO_PLAYER/
├── src/
│   ├── components/
│   │   └── SynchronizedVideoPlayer.tsx
│   ├── types/
│   └── App.tsx
├── public/
├── package.json
└── README.md
```

## 🎯 Core Components

### VideoPlayerState Interface
```typescript
interface VideoPlayerState {
  isVideoReady: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isDragging: boolean;
}
```

### Key Features Implementation

- **File Upload:** Secure file handling with validation
- **Progress Synchronization:** Real-time sync between video and progress bar
- **Drag Interactions:** Smooth scrubbing with visual feedback
- **Error Handling:** Comprehensive error detection and user feedback
- **Memory Management:** Automatic cleanup of object URLs

## 🔧 Configuration

### Customization Options

```jsx
// Modify these values in the component
const SUPPORTED_FORMATS = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
const PROGRESS_UPDATE_INTERVAL = 100; // milliseconds
const DRAG_SENSITIVITY = 1; // 1 = normal sensitivity
```

### Styling

The player uses Tailwind CSS classes. Key customization points:

```css
/* Progress bar colors */
.bg-blue-500 /* Progress fill */
.bg-gray-600 /* Progress track */
.bg-white /* Progress handle */

/* Theme colors */
.bg-gray-900 /* Main background */
.bg-gray-800 /* Card backgrounds */
```

## 🐛 Troubleshooting

### Common Issues

**Video won't play**
- Check file format compatibility
- Ensure browser supports the video codec
- Try a different video file

**Progress bar not syncing**
- Verify video metadata is loaded
- Check browser console for errors

**File upload fails**
- Confirm file is a valid video format
- Check file size (browser limitations)
- Try a smaller file for testing

### Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE11 | ❌ Not supported |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add unit tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide React for beautiful icons
- The open-source community for inspiration

## 📞 Contact

KingJames - [omekejames1@gmail.com](https://github.com/kingjames511)

Project Link: https://github.com/kingjames511/VIDEO_PLAYER

---

⭐ **Star this repository if you found it helpful!**
