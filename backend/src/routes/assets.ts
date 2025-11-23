import { Router } from 'express';
import axios from 'axios';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { createAsset, getUserAssets, getAssetById } from '../models/Asset';
import { getMLServiceURL } from '../services/mlService';
import path from 'path';
import fs from 'fs';

export const assetRoutes = Router();

// All routes require authentication
assetRoutes.use(requireAuth);

// Get ML service URL (use integrated service or external)
function getMLURL(): string {
  // If external ML service URL is provided, use it
  if (process.env.ML_SERVICE_URL) {
    return process.env.ML_SERVICE_URL;
  }
  // Otherwise use the integrated ML service
  return getMLServiceURL();
}

// Generate new asset
assetRoutes.post('/generate', async (req: AuthenticatedRequest, res) => {
  try {
    const { prompt, style, assetType, polyCount, lodLevel, outputFormat, name } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const mlServiceURL = getMLURL();
    console.log(`Calling ML service at: ${mlServiceURL}/ml/generate-asset`);
    console.log(`Calling ML service at: ${mlServiceURL}/ml/generate-asset`);

    // Forward request to ML service
    try {
      const mlResponse = await axios.post(`${mlServiceURL}/ml/generate-asset`, {
        prompt,
        style: style || 'low-poly',
        asset_type: assetType || 'prop',
        poly_count: polyCount || 1000,
        lod_level: lodLevel || 0,
        output_format: outputFormat || 'gltf'
      }, {
        timeout: 60000 // 60 second timeout for asset generation
      });

      const { file_path, metadata } = mlResponse.data;

      // Save asset metadata to database
      const asset = createAsset({
        user_id: req.userId!,
        name: name || `Generated ${assetType || 'asset'}`,
        description: prompt,
        asset_type: assetType || 'prop',
        file_path,
        file_format: outputFormat || 'gltf',
        poly_count: metadata.poly_count,
        material_slots: metadata.material_slots,
        style: style || 'low-poly',
        tags: JSON.stringify({ style, assetType })
      });

      res.json(asset);
    } catch (mlError: any) {
      console.error('ML service error:', mlError.message || mlError);
      console.error('ML service URL:', mlServiceURL);
      if (mlError.response) {
        console.error('ML service response:', mlError.response.status, mlError.response.data);
        return res.status(mlError.response.status || 500).json({
          error: mlError.response.data?.error || 'ML service error',
          details: process.env.NODE_ENV === 'development' ? mlError.message : undefined
        });
      }
      return res.status(503).json({ 
        error: 'ML service unavailable',
        details: process.env.NODE_ENV === 'development' ? mlError.message : undefined
      });
    }
  } catch (error: any) {
    console.error('Error generating asset:', error);
    console.error('Error stack:', error.stack);
    const errorMessage = error.message || 'Failed to generate asset';
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's assets
assetRoutes.get('/', (req: AuthenticatedRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const assets = getUserAssets(req.userId!, limit, offset);
    res.json(assets);
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch assets' });
  }
});

// Get asset by ID
assetRoutes.get('/:id', (req: AuthenticatedRequest, res) => {
  try {
    const asset = getAssetById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    if (asset.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(asset);
  } catch (error: any) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch asset' });
  }
});

// Download asset file
assetRoutes.get('/:id/download', (req: AuthenticatedRequest, res) => {
  try {
    const asset = getAssetById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    if (asset.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    const filePath = path.resolve(asset.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Asset file not found' });
    }

    // Stream file to client
    res.download(filePath, `${asset.name}.${asset.file_format}`);
  } catch (error: any) {
    console.error('Error downloading asset:', error);
    res.status(500).json({ error: error.message || 'Failed to download asset' });
  }
});