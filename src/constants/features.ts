export const FEATURES = {
  basicNavigation: {
    name: 'Basic Navigation',
    enabled: true,
    description: 'Navigate through dataset rows',
    dependencies: []
  },
  statusTracking: {
    name: 'Status Tracking',
    enabled: true,
    description: 'Track review status of rows',
    dependencies: ['basicNavigation']
  }
} as const;