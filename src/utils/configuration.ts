export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 512;
export const BACKGROUND_DEPTH = 0;
export const BACKGROUND_SPEED = 1;
export const GROUND_DEPTH = 2;
export const GROUND_HEIGHT = 36;
export const GROUND_SPEED = 2;

export const BIRD_DEPTH = 10;
export const BIRD_OFFSET_X = 100;
export const IDLE_OFFEST_Y = 20;

export const PIPE_DEPTH = 1;
export const PIPE_OFFSET_X = 50;
export const PIPE_SPEED = 2.5;
export const PIPE_GAP_X_BASE = 700;
export const PIPE_GAP_Y_BASE = 350;
export const GAP_X_REDUCTION = 100;
export const GAP_Y_REDUCTION = 25;
export const DIFFICULTY_INTERVAL = 20000;
export const DIFFICULTY_LEVEL_MAX = 4;

export const CLOUD_DEPTH = 5;
export const CLOUD_GAP_X = 125;
export const CLOUD_OFFSET_X = 100;
export const CLOUD_OFFSET_Y = 50;

export const THUNDER_DEPTH = 50;

export const JUMP_STRENGTH = 350;
export const GRAVITY = 20;

export interface PipeType {
  key: string;          
  scale: number;        
}

export const PIPE_TYPES: PipeType[] = [
    { key: "pipe-5", scale: 0.7 }, 
    { key: "pipe-6", scale: 0.7 }, 
    { key: "pipe-1", scale: 0.3 }, 
    { key: "pipe-2", scale: 0.7 }, 
    { key: "pipe-3", scale: 0.8 }, 
    { key: "pipe-4", scale: 0.8 }, 
];
