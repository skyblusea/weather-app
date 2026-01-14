export type HeaderType = 'default' | 'json' | 'multipart';

const headerConfigs: Record<HeaderType, Record<string, string>> = {
  default: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  json: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  multipart: {
    'Content-Type': 'multipart/form-data',
  },
} as const;

export default headerConfigs;
