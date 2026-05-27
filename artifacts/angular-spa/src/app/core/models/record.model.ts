export interface AppRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  accessLevel: 'all' | 'admin';
  priority: 'high' | 'medium' | 'low';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsResponse {
  records: AppRecord[];
  meta: {
    total: number;
    delay: number;
    role: string;
    timestamp: string;
  };
}
