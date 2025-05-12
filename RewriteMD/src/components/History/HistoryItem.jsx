import React from 'react';
import './HistoryItem.css';

const HistoryItem = ({ item }) => {
    if (!item) {
        return null;
    }

    const { imageThumbnailSrc, textSnippet, timestamp } = item;

    return (
        <div className="history-item">
            {imageThumbnailSrc && (
                <img src={imageThumbnailSrc} alt="History thumbnail" className="history-item-thumbnail" />
            )}
            <div className="history-item-details">
                <p className="history-item-text">{textSnippet || 'No text snippet'}</p>
                <p className="history-item-timestamp">{timestamp || 'No date'}</p>
            </div>
        </div>
    );
};

export default HistoryItem; 