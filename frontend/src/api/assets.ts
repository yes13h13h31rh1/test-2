import client from './client';
import { Asset, AssetGenerationRequest } from '../types';

export async function generateAsset(request: AssetGenerationRequest): Promise<Asset> {
  const response = await client.post<Asset>('/api/assets/generate', request);
  return response.data;
}

export async function getAssets(limit = 50, offset = 0): Promise<Asset[]> {
  const response = await client.get<Asset[]>('/api/assets', {
    params: { limit, offset }
  });
  return response.data;
}

export async function getAsset(id: string): Promise<Asset> {
  const response = await client.get<Asset>(`/api/assets/${id}`);
  return response.data;
}

export function getAssetDownloadUrl(id: string): string {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${API_URL}/api/assets/${id}/download`;
}
