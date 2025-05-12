import React from 'react';
import HistoryItem from './HistoryItem';
import './HistorySection.css';

const HistorySection = ({ historyLog }) => {
    if (!historyLog || historyLog.length === 0) {
        return (
            <div className="history-section empty">
                <p>No history yet. Process an image to see it here.</p>
            </div>
        );
    }

    return (
        <div className="history-section">
            <div className="history-list">
                {historyLog.map((item) => (
                    <HistoryItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default HistorySection; 