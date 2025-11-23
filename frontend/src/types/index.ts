export enum ScriptType {
  ABILITY = 'ability',
  GAME_MODE = 'game_mode',
  TRIGGER_DEVICE = 'trigger_device',
  UI_LOGIC = 'ui_logic',
  WAVE_SPAWNER = 'wave_spawner',
  WEAPON = 'weapon',
  CUSTOM = 'custom'
}

export interface Script {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  script_type: string;
  code: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  asset_type: string;
  file_path: string;
  file_format: string;
  poly_count?: number;
  material_slots?: number;
  style?: string;
  tags?: string;
  created_at: string;
}

export interface ScriptGenerationRequest {
  description: string;
  scriptType: ScriptType;
  name?: string;
  constraints?: {
    performance?: string;
    complexity?: string;
  };
}

export interface AssetGenerationRequest {
  prompt: string;
  style?: string;
  assetType?: string;
  polyCount?: number;
  lodLevel?: number;
  outputFormat?: string;
  name?: string;
}
