export const defaultconfig: Config = {
  theme: 'light',
  language: 'zh',
  retentionDays: 30,
  autoClean: true,
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


export interface Note {
  id: string;
  title: string;
  tags: string[];
  pinned: boolean;
  content: string;
  color: string;
  createdAt: string; // 时间戳
  updatedAt: string; // 时间戳

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
}
