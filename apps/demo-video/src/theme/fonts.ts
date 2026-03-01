import { loadFont as loadSyne } from '@remotion/google-fonts/Syne';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';

export const { fontFamily: syne } = loadSyne('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});
export const { fontFamily: inter } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});
export const { fontFamily: jetbrainsMono } = loadJetBrainsMono('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});
export const { fontFamily: cormorant } = loadCormorant('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
