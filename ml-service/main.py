from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from services.asset_generator import AssetGenerator

load_dotenv()

app = FastAPI(title="UEFN ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize asset generator
# Use Render disk path if available, otherwise use env var or default
assets_dir = os.getenv("RENDER_DISK_PATH") or os.getenv("ASSETS_DIR", "./generated_assets")
if os.getenv("RENDER_DISK_PATH"):
    assets_dir = os.path.join(os.getenv("RENDER_DISK_PATH"), "generated_assets")

asset_generator = AssetGenerator(assets_dir=assets_dir)

class AssetGenerationRequest(BaseModel):
    prompt: str
    style: Optional[str] = "low-poly"
    asset_type: Optional[str] = "prop"
    poly_count: Optional[int] = 1000
    lod_level: Optional[int] = 0
    output_format: Optional[str] = "gltf"

@app.get("/ml/health")
async def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/ml/generate-asset")
async def generate_asset(request: AssetGenerationRequest):
    """
    Generate a 3D asset based on the provided prompt.
    
    This is a placeholder implementation that creates procedural meshes.
    To integrate a real ML model:
    1. Replace the generate_mesh() call in asset_generator.py with your model
    2. Add model weights/files to ml-service/models/
    3. Update requirements.txt with model dependencies
    """
    try:
        result = asset_generator.generate(
            prompt=request.prompt,
            style=request.style,
            asset_type=request.asset_type,
            target_poly_count=request.poly_count,
            lod_level=request.lod_level,
            output_format=request.output_format
        )
        
        return {
            "file_path": result["file_path"],
            "metadata": result["metadata"]
        }
    except Exception as e:
        print(f"Error generating asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
