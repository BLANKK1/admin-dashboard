export interface AuditEntry {
  id: string;
  action: 'login' | 'logout' | 'user_create' | 'user_update' | 'user_delete';
  actorId: string;
  actorName: string;
  targetId?: string;
  targetName?: string;
  detail: string;
  timestamp: string;
}
