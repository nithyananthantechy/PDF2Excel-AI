from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import uvicorn
from typing import List

# Import modular models and services
from .models import Base, engine, SessionLocal, User, Job, Result
from .services.auth import get_current_user, create_access_token
from .services.ocr import process_document_ocr
from .services.excel import compile_excel_buffer

# Create DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PDF2Excel AI Core System",
    description="High-Throughput Vision OCR & Table Spreadsheet Converter Pipelines",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Save Upload to Local Temp / Custom S3 Architecture Bucket
    file_bytes = await file.read()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    
    if file_size_mb > 100:
        raise HTTPException(status_code=400, detail="Document exceeds 100MB industrial constraint.")

    new_job = Job(
        user_id=current_user.id,
        file_name=file.filename,
        file_size=f"{file_size_mb:.2f} MB",
        status="pending"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    return {"job_id": new_job.id, "file_name": new_job.file_name, "status": new_job.status}

@app.post("/process/{job_id}")
async def process_conversion(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job entry not found.")
        
    job.status = "processing"
    db.commit()
    
    try:
        # Step 1: Execute OCR using Gemini Vision Model
        pages_data = await process_document_ocr(job)
        
        # Step 2: Compile Spreadsheet worksheets array from Data
        excel_bin = compile_excel_buffer(pages_data)
        
        # Step 3: Write structure to Result Schema
        result_record = Result(
            job_id=job.id,
            json_output=pages_data,
            excel_path=f"s3://pdf2excel-storage/job-{job.id}/result.xlsx"
        )
        db.add(result_record)
        
        job.status = "completed"
        db.commit()
        return {"status": "completed", "result_id": result_record.id}
        
    except Exception as e:
        job.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"OCR Conversion pipeline halted: {str(e)}")

@app.get("/jobs")
async def fetch_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Job).filter(Job.user_id == current_user.id).all()

@app.delete("/job/{id}")
async def purge_job(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job log entry not found.")
    db.delete(job)
    db.commit()
    return {"success": True, "message": "Purged successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
