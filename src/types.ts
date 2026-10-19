export type ThemeMode = 'light' | 'dark';
export type ThemePalette = 'traditional' | 'sepia' | 'oceanic' | 'legacy' | 'high-contrast';
export type PresentationMode = 'scroll' | 'slides';
export type LayoutMode = 'column' | 'row';

export interface LanguageInfo {
  name: string;
  category: 'main' | 'unofficial';
  isAuto: boolean;
  isEthiopic?: boolean;
  isSeekingScribe?: boolean;
}

export interface FontSizes {
  geez: number;
  english: number;
  locked: boolean;
}

export interface DisplayOptions {
  presentationMode: PresentationMode;
  layout: LayoutMode;
  boldText: boolean;
  showLanguageLabels: boolean;
  showSpeakerLabels: boolean;
  paragraphMode: boolean;
  showRubrication: boolean;
  languageColorCoding: string;
  dynamicFontSizing: boolean;
  forceUniformFontSize: boolean;
  slideTransition: 'fade' | 'slide' | 'zoom' | 'none';
  showGeezPhoneticChants: boolean;
  showLoanwordOrigins: boolean;
}

export interface CustomNames {
  servant?: string;
  patriarch?: string;
  bishop?: string;
  attendingBishops?: string;
  churchName?: string;
  country?: string;
  headOfState?: string;
  bridegroom?: string;
  bride?: string;
}

export interface LiturgyRefs {
  morningPsalm: string;
  morningGospel: string;
  eveningPsalm: string;
  eveningGospel: string;
  pauline: string;
  universal: string;
  acts: string;
  psalm: string;
  gospel: string;
}
