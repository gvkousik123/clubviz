export const STORAGE_KEYS = {
  accessToken: 'clubviz-accessToken',
  refreshToken: 'clubviz-refreshToken',
  user: 'clubviz-user',
  pendingPhone: 'clubviz-pendingPhone',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
