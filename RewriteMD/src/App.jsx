import './App.css'
import React, { useState } from 'react';
import CmpFooter from './components/Footer/CmpFooter';
import CmpContent from './components/Content/CmpContent';
import CmpSider from './components/Sider/CmpSider';

// Helper function to generate a data URL from a File object for thumbnails
const generateThumbnailDataUrl = (file, callback) => {
    if (!file || !file.type.startsWith('image/')) {
        callback(null);
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        callback(e.target.result);
    };
    reader.onerror = () => {
        callback(null);
    };
    reader.readAsDataURL(file);
};

function App() {
  const [historyLog, setHistoryLog] = useState([]);

  const addHistoryEntry = (itemDetails) => {
    const { file, textSnippet, type } = itemDetails;

    const createEntry = (thumbnailSrc) => {
        const newHistoryItem = {
            id: Date.now(),
            imageThumbnailSrc: thumbnailSrc,
            textSnippet: textSnippet,
            timestamp: new Date().toLocaleString(),
            type: type
        };
        setHistoryLog(prevLog => [newHistoryItem, ...prevLog.slice(0, 19)]); // Keep max 20
    };

    if (file) {
        generateThumbnailDataUrl(file, (thumbnailSrc) => {
            createEntry(thumbnailSrc);
        });
    } else {
        createEntry(null); // For entries without an image, like a text-only action if ever needed
    }
  };

  return (
    <div className="layout">
      <CmpSider historyLog={historyLog} />
      <CmpContent onAddHistoryEntry={addHistoryEntry} />
      <CmpFooter/>
    </div>
  )
}

export default App
