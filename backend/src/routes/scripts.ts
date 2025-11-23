import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { generateScript, ScriptType } from '../services/scriptGenerator';
import { createScript, getUserScripts, getScriptById, deleteScript } from '../models/Script';

export const scriptRoutes = Router();

// All routes require authentication
scriptRoutes.use(requireAuth);

// Generate new script
scriptRoutes.post('/generate', async (req: AuthenticatedRequest, res) => {
  try {
    const { description, scriptType, constraints, name } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!scriptType || !Object.values(ScriptType).includes(scriptType)) {
      return res.status(400).json({ error: 'Valid scriptType is required' });
    }

    // Generate script code
    const code = generateScript({
      description,
      scriptType: scriptType as ScriptType,
      constraints
    });

    // Save to database
    const script = createScript({
      user_id: req.userId!,
      name: name || `Generated ${scriptType} script`,
      description,
      script_type: scriptType,
      code,
      tags: constraints ? JSON.stringify(constraints) : undefined
    });

    res.json(script);
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: error.message || 'Failed to generate script' });
  }
});

// Get user's scripts
scriptRoutes.get('/', (req: AuthenticatedRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const scripts = getUserScripts(req.userId!, limit, offset);
    res.json(scripts);
  } catch (error: any) {
    console.error('Error fetching scripts:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch scripts' });
  }
});

// Get script by ID
scriptRoutes.get('/:id', (req: AuthenticatedRequest, res) => {
  try {
    const script = getScriptById(req.params.id);
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    if (script.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(script);
  } catch (error: any) {
    console.error('Error fetching script:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch script' });
  }
});

// Delete script
scriptRoutes.delete('/:id', (req: AuthenticatedRequest, res) => {
  try {
    const deleted = deleteScript(req.params.id, req.userId!);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Script not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting script:', error);
    res.status(500).json({ error: error.message || 'Failed to delete script' });
  }
});
