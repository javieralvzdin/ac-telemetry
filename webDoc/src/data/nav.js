export const nav = [
  {
    title: { en: 'Session Log', es: 'Registro de sesión' },
    featured: true,
    pages: [
      {
        title: { en: 'Barcelona · Porsche 911 RSR', es: 'Barcelona · Porsche 911 RSR' },
        slug: 'session-log',
        description: {
          en: 'Full session report: warm-up lap vs hotlap, corner by corner.',
          es: 'Informe completo de la sesión: vuelta de calentamiento frente a vuelta rápida, curva a curva.'
        }
      }
    ]
  },
  {
    title: { en: 'Get Started', es: 'Primeros pasos' },
    pages: [
      {
        title: { en: 'Overview', es: 'Resumen' },
        slug: 'overview',
        description: {
          en: 'What this project is and how the pieces fit together.',
          es: 'Qué es este proyecto y cómo encajan sus piezas.'
        }
      },
      {
        title: { en: 'Installation & Usage', es: 'Instalación y uso' },
        slug: 'installation',
        description: {
          en: 'Get the pipeline running end to end.',
          es: 'Pon en marcha el pipeline de principio a fin.'
        }
      }
    ]
  },
  {
    title: { en: 'Architecture', es: 'Arquitectura' },
    pages: [
      {
        title: { en: 'System Architecture', es: 'Arquitectura del sistema' },
        slug: 'architecture',
        description: {
          en: 'The three-layer design: acquisition, processing, storage & visualization.',
          es: 'El diseño de tres capas: adquisición, procesamiento, almacenamiento y visualización.'
        }
      },
      {
        title: { en: 'Hardware Bridge (C / UDP)', es: 'Puente de hardware (C / UDP)' },
        slug: 'hardware-bridge',
        description: {
          en: 'How ac_telemetry.dll talks to Assetto Corsa.',
          es: 'Cómo se comunica ac_telemetry.dll con Assetto Corsa.'
        }
      },
      {
        title: { en: 'Data Pipeline (Python)', es: 'Pipeline de datos (Python)' },
        slug: 'data-pipeline',
        description: {
          en: 'How dashboard.py bridges the DLL to InfluxDB.',
          es: 'Cómo conecta dashboard.py la DLL con InfluxDB.'
        }
      },
      {
        title: { en: 'Storage & Visualization', es: 'Almacenamiento y visualización' },
        slug: 'storage-visualization',
        description: {
          en: 'InfluxDB and Grafana.',
          es: 'InfluxDB y Grafana.'
        }
      }
    ]
  },
  {
    title: { en: 'Reference', es: 'Referencia' },
    pages: [
      {
        title: { en: 'Troubleshooting', es: 'Solución de problemas' },
        slug: 'troubleshooting',
        description: {
          en: 'Common issues and fixes.',
          es: 'Problemas comunes y sus soluciones.'
        }
      }
    ]
  }
];

export function flattenNav() {
  return nav.flatMap((section) => section.pages);
}
