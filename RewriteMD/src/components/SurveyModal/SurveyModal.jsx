import React, { useState } from 'react';
import './SurveyModal.css';

// Placeholder SVGs - replace with your actual SVGs or import them
const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
    </svg>
);

const ThumbsDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
    </svg>
);

const SurveyModal = ({ isOpen, onClose, onSubmit }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(null); // null, 'good', or 'bad'

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => {
        if (rating === null) {
            alert('Please select a rating (Good or Bad) before submitting.');
            return;
        }
        onSubmit({ text: feedbackText, rating });
        setFeedbackText(''); // Reset for next time
        setRating(null);    // Reset rating
        onClose(); // Close modal after submit
    };

    const handleRating = (newRating) => {
        setRating(newRating);
    };

    return (
        <div className="survey-modal-overlay">
            <div className="survey-modal-content">
                <h2>Rate Our Performance</h2>
                <textarea
                    className="survey-feedback-text"
                    placeholder="Optional: Share your thoughts..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                />
                <div className="survey-ratings">
                    <button
                        className={`survey-rating-btn good ${rating === 'good' ? 'selected' : ''}`}
                        onClick={() => handleRating('good')}
                        aria-label="Rate as Good"
                    >
                        <ThumbsUpIcon />
                    </button>
                    <button
                        className={`survey-rating-btn bad ${rating === 'bad' ? 'selected' : ''}`}
                        onClick={() => handleRating('bad')}
                        aria-label="Rate as Bad"
                    >
                        <ThumbsDownIcon />
                    </button>
                </div>
                <div className="survey-actions">
                    <button className="btn survey-submit-btn" onClick={handleSubmit}>
                        Submit Feedback
                    </button>
                    <button className="btn survey-close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyModal; 