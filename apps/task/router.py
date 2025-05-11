from fastapi import APIRouter, File, UploadFile, HTTPException, Body
from fastapi.responses import JSONResponse,HTMLResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import io
import os
from datetime import datetime
import easyocr
from pathlib import Path
import csv # Added for CSV writing

router = APIRouter()

def preprocess_image(image):
    # Resize image if it's too large (faster processing)
    max_size = 2000
    if max(image.size) > max_size:
        ratio = max_size / max(image.size)
        new_size = tuple(int(dim * ratio) for dim in image.size)
        image = image.resize(new_size, Image.Resampling.LANCZOS)
    
    # Convert to grayscale
    image = image.convert('L')
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)
    
    # Enhance brightness
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.2)
    
    return image

@router.post("/ingest/image")
async def file_upload(file: UploadFile = File(...)):
    try:
        # Validate file is an image
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        contents = await file.read()
        
        # Process image
        image = Image.open(io.BytesIO(contents))
        image = image.convert("RGB")
        
        # Save the original image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"upload_{timestamp}_{file.filename}"
        save_path = os.path.join("uploads", filename)
        image.save(save_path)

        # Create rewriten directory if it doesn't exist
        rewriten_dir = Path("rewriten")
        rewriten_dir.mkdir(exist_ok=True)

        # Preprocess the image for better OCR
        processed_image = preprocess_image(image)
        
        # Save the processed image for debugging
        processed_path = os.path.join("uploads", f"processed_{filename}")
        processed_image.save(processed_path)

        # Initialize EasyOCR reader (English language)
        reader = easyocr.Reader(['en'])
        
        # Perform OCR on the processed image
        try:
            # Get text from image
            results = reader.readtext(processed_path)
            
            # Extract text and sort by vertical position (top to bottom)
            text_blocks = []
            current_block = []
            last_y = -1
            
            for (bbox, text, prob) in sorted(results, key=lambda x: x[0][0][1]):  # Sort by y-coordinate
                y_pos = bbox[0][1]  # Get y-coordinate of the text
                
                # If this text is significantly lower than the last one, start a new block
                if last_y != -1 and y_pos - last_y > 20:  # 20 pixels threshold
                    if current_block:
                        text_blocks.append(' '.join(current_block))
                        current_block = []
                
                current_block.append(text)
                last_y = y_pos
            
            # Add the last block if it exists
            if current_block:
                text_blocks.append(' '.join(current_block))
            
            # Join all blocks with newlines
            text_content = '\n'.join(text_blocks)
            
            # Save text to file
            text_filename = f"{os.path.splitext(filename)[0]}.txt"
            text_path = os.path.join("rewriten", text_filename)
            
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(text_content)
            
        except Exception as e:
            text_content = f"Error during text recognition: {str(e)}"
        
        return {
            "success": True,
            "filename": file.filename,
            "saved_path": save_path,
            "processed_path": processed_path,
            "dimensions": f"{image.width}x{image.height}",
            "text_content": text_content,
            "message": "Image processed successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot process image: {str(e)}"
        )

@router.post("/save/text")
async def save_text_to_file(payload: dict = Body(...)):
    try:
        text_content = payload.get("text")
        if text_content is None:
            raise HTTPException(status_code=400, detail="'text' field is required in payload.")

        # Create lastversion directory if it doesn't exist
        lastversion_dir = Path("lastversion")
        lastversion_dir.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"saved_text_{timestamp}.txt"
        save_path = lastversion_dir / filename

        with open(save_path, 'w', encoding='utf-8') as f:
            f.write(text_content)
        
        return {
            "success": True,
            "message": f"Text saved successfully to {save_path}",
            "filepath": str(save_path)
        }
    except HTTPException as e: # Re-raise HTTPException to ensure FastAPI handles it
        raise e 
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save text: {str(e)}"
        )

@router.post("/submit/feedback")
async def submit_user_feedback(payload: dict = Body(...)):
    try:
        feedback_text = payload.get("feedback_text", "") # Default to empty string if not provided
        rating = payload.get("rating")
        original_ocr_text = payload.get("original_ocr_text", "")
        downloaded_text = payload.get("downloaded_text", "")

        if rating is None:
            raise HTTPException(status_code=400, detail="'rating' field is required in feedback payload.")

        # Create feedbacks directory if it doesn't exist
        feedbacks_dir = Path("feedbacks")
        feedbacks_dir.mkdir(exist_ok=True)
        feedback_file_path = feedbacks_dir / "feedbacks.csv"

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Define header and row
        header = ["Timestamp", "Rating", "FeedbackText", "OriginalOCRText", "DownloadedText"]
        row = [timestamp, rating, feedback_text, original_ocr_text, downloaded_text]

        file_exists = feedback_file_path.exists()

        with open(feedback_file_path, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            if not file_exists:
                writer.writerow(header) # Write header if file is new
            writer.writerow(row)
        
        return {
            "success": True,
            "message": "Feedback submitted successfully."
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not submit feedback: {str(e)}"
        )
