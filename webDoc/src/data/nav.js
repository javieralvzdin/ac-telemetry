export const nav = [
  {
    title: 'Session Log',
    featured: true,
    pages: [
      { title: 'Barcelona · Porsche 911 RSR', slug: 'session-log', description: 'Full session report: warm-up lap vs hotlap, corner by corner.' },
    ],
  },
  {
    title: 'Get Started',
    pages: [
      { title: 'Overview', slug: 'overview', description: 'What this project is and how the pieces fit together.' },
      { title: 'Installation & Usage', slug: 'installation', description: 'Get the pipeline running end to end.' },
    ],
  },
  {
    title: 'Architecture',
    pages: [
      { title: 'System Architecture', slug: 'architecture', description: 'The three-layer design: acquisition, processing, storage & visualization.' },
      { title: 'Hardware Bridge (C / UDP)', slug: 'hardware-bridge', description: 'How ac_telemetry.dll talks to Assetto Corsa.' },
      { title: 'Data Pipeline (Python)', slug: 'data-pipeline', description: 'How dashboard.py bridges the DLL to InfluxDB.' },
      { title: 'Storage & Visualization', slug: 'storage-visualization', description: 'InfluxDB and Grafana.' },
    ],
  },
  {
    title: 'Reference',
    pages: [
      { title: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and fixes.' },
    ],
  },
];

export function flattenNav() {
  return nav.flatMap((section) => section.pages);
}
