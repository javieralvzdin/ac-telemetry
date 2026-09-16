import { useLanguage } from './LanguageContext.jsx';

export const strings = {
  en: {
    brand: 'AC Telemetry',
    githubLabel: 'View source on GitHub',
    searchPlaceholder: 'Search docs...',
    searchAriaLabel: 'Search documentation',
    scrollHint: 'Scroll',
    sessionCta: 'View Session Log',
    docsNavAriaLabel: 'Documentation',
    heroShowroomAlt: 'Assetto Corsa showroom',
    langSwitchAriaLabel: 'Language'
  },
  es: {
    brand: 'AC Telemetry',
    githubLabel: 'Ver código en GitHub',
    searchPlaceholder: 'Buscar en la documentación...',
    searchAriaLabel: 'Buscar documentación',
    scrollHint: 'Desplázate',
    sessionCta: 'Ver registro de sesión',
    docsNavAriaLabel: 'Documentación',
    heroShowroomAlt: 'Sala de exposición de Assetto Corsa',
    langSwitchAriaLabel: 'Idioma'
  }
};

export function useT() {
  const { lang } = useLanguage();
  return strings[lang] ?? strings.en;
}
