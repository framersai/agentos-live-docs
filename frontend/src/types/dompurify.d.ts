declare module 'dompurify' {
  interface SanitizeConfig {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    [key: string]: unknown;
  }

  type SanitizeInput = string | Node;

  interface DOMPurifyInstance {
    sanitize(input: SanitizeInput, config?: SanitizeConfig): string;
  }

  const DOMPurify: DOMPurifyInstance;
  export default DOMPurify;
}
