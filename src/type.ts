export const defaultconfig: Config = {
  theme: 'light',
  language: 'zh',
  retentionDays: 30,
  autoClean: true,
  contextmenutheme: 'default'
}


export enum EncryptionAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
  AES_256_CBC = 'aes-256-cbc',
  AES_256_CTR = 'aes-256-ctr',
  AES_256_CFB = 'aes-256-cfb',
  AES_256_OFB = 'aes-256-ofb'
}



export type Theme = 'system' | 'light' | 'dark'
export type Language = 'zh' | 'en'

// 回收站配置
export interface TrashConfig {
  retentionDays: number; // 保留天数（默认30天）
  autoClean: boolean;    // 是否自动清理
}

export interface Config {
  theme: Theme;
  language: Language;
  contextmenutheme: 'default' | 'flat' | 'win10' | 'mac';
  retentionDays: number; // 保留天数（默认30天）
  autoClean: boolean;    // 是否自动清理


}
export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string; // 时间戳
  updatedAt: string; // 时间戳
}

export const NOTE_COLORS = {
  yellow: {
    light: '#fff9c4',
    dark: '#f9a825'
  },
  green: {
    light: '#c8e6c9',
    dark: '#2e7d32'
  },
  blue: {
    light: '#bbdefb',
    dark: '#1565c0'
  },
  pink: {
    light: '#f8bbd0',
    dark: '#c2185b'
  },
  purple: {
    light: '#e1bee7',
    dark: '#7b1fa2'
  },
  orange: {
    light: '#ffccbc',
    dark: '#e64a19'
  }
} as const;


export type NoteColorType = keyof typeof NOTE_COLORS;


export interface Note {
  id: string;
  title: string;
  tags: string[];
  pinned: boolean;
  star: boolean;
  content: string;
  color: NoteColorType;
  createdAt: string; // 时间戳
  updatedAt: string; // 时间戳

  // 加密相关字段
  isEncrypted?: boolean;
  encryptedContent?: string;
  salt?: string;
  iv?: string;
  algorithm?: EncryptionAlgorithm;

  // 回收站相关的新增字段
  deleted: boolean;        // 标记是否已被删除（在回收站中）
  deletedAt?: string;        // 删除时间（用于自动清理）
  originalPosition?: number; // 原始位置（用于恢复时还原位置）
}

// 回收站操作类型
export interface TrashAction {
  type: 'delete' | 'restore' | 'permanent-delete';
  noteId: string;
  timestamp: Date;
}

export interface TagState {
  tags: Tag[];
  selectedTag: string | null; // 当前选中的标签ID
}

export interface NoteState {
  notes: Note[];
  searchQuery: string; // 搜索查询
  filterType: 'pinned' | 'star' | 'title'; // 过滤类型
}


export type ViewType = 'grid' | 'kanban' | 'calendar' | 'timeline' | 'list';

export interface ViewOption {
  type: ViewType;
  label: string;
  icon: string;
  description: string;
  available: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tagId?: string;
  color: string;
  order: number;
  width: number;
}