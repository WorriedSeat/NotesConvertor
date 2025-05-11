import './CmpContent.css';
import './TextSection.css';
import './ImageSection.css';
import './Buttons.css';
import ImageHandler from './ImageHandler';
import SurveyModal from '../SurveyModal/SurveyModal';
import { useState, useEffect } from 'react';

export default function CmpContent(){
    const [textContent, setTextContent] = useState('');
    const [originalOcrText, setOriginalOcrText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [animatedPlaceholder, setAnimatedPlaceholder] = useState("Processing...");
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isProcessing) {
            const placeholderStates = ["Processing.", "Processing..", "Processing..."];
            let currentStateIndex = 0;
            setAnimatedPlaceholder(placeholderStates[currentStateIndex]);

            intervalId = setInterval(() => {
                currentStateIndex = (currentStateIndex + 1) % placeholderStates.length;
                setAnimatedPlaceholder(placeholderStates[currentStateIndex]);
            }, 500);
        } else {
            // Reset when not processing, handled by the ternary in placeholder prop
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isProcessing]);

    const handleImageSelect = (file) => {
        setSelectedFile(file);
        if (file === null) {
            setTextContent('');
            setOriginalOcrText('');
        }
    };

    const handleRewrite = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setTextContent('');
        setOriginalOcrText('');
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://localhost:8000/ingest/image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.text_content) {
                setTextContent(data.text_content);
                setOriginalOcrText(data.text_content);
            } else {
                setTextContent('');
                setOriginalOcrText('');
            }
        } catch (error) {
            setTextContent('');
            setOriginalOcrText('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadAndSave = async () => {
        if (!textContent) {
            alert("There is no text to download or save.");
            return;
        }

        // Client-side download as .md
        const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = "edited_content.md";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);

        setIsSurveyModalOpen(true);

        // Server-side saving of edited text as .txt
        try {
            const response = await fetch('http://localhost:8000/save/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textContent }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save edited text on server');
            }
            const result = await response.json();
            console.log('Edited text saved on server:', result.message); 
        } catch (error) {
            console.error('Error saving edited text on server:', error);
            alert('Error saving edited text on server: ' + error.message);
        }
    };

    const handleCloseSurvey = () => {
        setIsSurveyModalOpen(false);
    };

    const handleSurveySubmit = async (surveyData) => {
        console.log('Survey Data Submitted to Frontend:', surveyData);
        const feedbackPayload = {
            feedback_text: surveyData.text,
            rating: surveyData.rating,
            original_ocr_text: originalOcrText,
            downloaded_text: textContent,
        };

        console.log("Sending to backend:", feedbackPayload);

        try {
            const response = await fetch('http://localhost:8000/submit/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackPayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit feedback to server');
            }
            const result = await response.json();
            console.log('Feedback submitted to server:', result.message);
            alert('Thank you for your feedback!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback: ' + error.message);
        }
    };

    return(
        <main className="content">
            <div className='section-container'>
                <ImageHandler onImageSelect={handleImageSelect} />

                <div className="text-section">
                    <textarea 
                        className="text-display" 
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder={isProcessing ? animatedPlaceholder : "The text from the image will appear here..."}
                        readOnly={isProcessing}
                    />
                </div>
            </div>

            <div className="action-buttons">
                <div className='image-buttons'>
                    <button 
                        className="btn rewrite-btn" 
                        onClick={handleRewrite}
                        disabled={!selectedFile || isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Rewrite'}
                    </button>
                </div>
                <div className='text-buttons'>
                    <button className="btn download-btn" onClick={handleDownloadAndSave}>Download</button>
                </div>
            </div>

            <SurveyModal 
                isOpen={isSurveyModalOpen}
                onClose={handleCloseSurvey}
                onSubmit={handleSurveySubmit}
            />
        </main>
    )
}