from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse,HTMLResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import os
from datetime import datetime

router = APIRouter()

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
        
        # Save the image (optional)
        # timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # filename = f"upload_{timestamp}_{file.filename}"
        # save_path = os.path.join("uploads", filename)
        # image.save(save_path)
        
        return {
            "success": True,
            "filename": file.filename,
            # "saved_path": save_path,
            "dimensions": f"{image.width}x{image.height}",
            "message": "Image processed successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot process image: {str(e)}"
        )
# @router.post("/delete")
# async def file_delete(filename: str):
#     try: 
#         upload_folder = "/uploads"
#         file_path = os.path.join(upload_folder, filename)
        
#         if os.path.exists(file_path):
#             os.remove(file_path)
#             return {"status": "success", "message": f"File {filename} deleted successfully"}
#         else:
#             raise HTTPException(status_code=404, detail="File not found")
            
#     except Exception as e:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Cannot delete file: {str(e)}"
#         )
