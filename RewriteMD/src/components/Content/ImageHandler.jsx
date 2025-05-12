import { useState } from 'react';
import './ImageSection.css';
import UploadIcon from '../../assets/icons/upload.svg';
import DeleteIcon from '../../assets/icons/delete.svg';

export default function ImageHandler({ onImageSelect }) {
    const [image, setImage] = useState(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const processFile = (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert("Please drop an image file."); // Or some other user feedback
            return;
        }

        const oldImageURL = image;
        if (oldImageURL) {
            URL.revokeObjectURL(oldImageURL); // Clean up previous object URL
        }

        setImage(URL.createObjectURL(file));
        if (onImageSelect) {
            onImageSelect(file);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const handleDeleteImage = () => {
        if (image) {
            URL.revokeObjectURL(image); // Clean up object URL when deleting
        }
        setImage(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = ''; // Reset file input
        }
        if (onImageSelect) {
            onImageSelect(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            processFile(file);
            e.dataTransfer.clearData(); // Clear the data transfer buffer
        }
    };

    return (
        <div className="image-section">
            <div className="image-upload">
                <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    className="upload-input"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <div className="button-section">
                    <label htmlFor="file-upload" className="custom-file-button">
                        <img src={UploadIcon} alt="Upload" className="icon" />
                    </label>
                    <button
                        className="delete-button"
                        onClick={handleDeleteImage}
                        disabled={!image}
                    >
                        <img src={DeleteIcon} alt="Delete" className="icon" />
                    </button>
                </div>
                <div
                    className={`image-preview ${image ? 'scrollable' : ''} ${isDraggingOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {image ? (
                        <img src={image} alt="Preview" />
                    ) : (
                        <div className="drop-prompt">
                            {isDraggingOver ? "Release to drop" : "Drag & drop image here, or click upload icon"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}