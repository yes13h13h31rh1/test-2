import client from './client';
import { Script, ScriptGenerationRequest } from '../types';

export async function generateScript(request: ScriptGenerationRequest): Promise<Script> {
  const response = await client.post<Script>('/api/scripts/generate', request);
  return response.data;
}

export async function getScripts(limit = 50, offset = 0): Promise<Script[]> {
  const response = await client.get<Script[]>('/api/scripts', {
    params: { limit, offset }
  });
  return response.data;
}

export async function getScript(id: string): Promise<Script> {
  const response = await client.get<Script>(`/api/scripts/${id}`);
  return response.data;
}

export async function deleteScript(id: string): Promise<void> {
  await client.delete(`/api/scripts/${id}`);
}
