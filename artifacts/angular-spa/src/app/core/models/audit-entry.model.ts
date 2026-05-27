export interface AuditEntry {
  id: string;
  action: 'login' | 'logout' | 'user_create' | 'user_update' | 'user_delete' | 'record_access_update';
  actorId: string;
  actorName: string;
  targetId?: string;
  targetName?: string;
  detail: string;
  timestamp: string;
}
