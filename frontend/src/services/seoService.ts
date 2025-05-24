// File: frontend/src/services/seoService.ts
/**
 * @fileoverview Service for managing Search Engine Optimization (SEO) aspects
 * such as dynamic meta tags and document head elements. This service helps
 * in making the Single Page Application (SPA) more crawler-friendly and improves
 * social sharing previews.
 * @module services/seoService
 */

import { SupportedLanguage } from '../types/i18n.types';

/**
 * Interface for the SEO Service.
 * Defines methods for updating various SEO-related elements in the document's head.
 * @interface ISeoService
 */
export interface ISeoService {
  /**
   * Updates the document title.
   * @param {string} title - The new title for the document.
   */
  setTitle(title: string): void;

  /**
   * Updates a meta tag identified by its 'name' or 'property' attribute.
   * If the tag does not exist, it will be created.
   *
   * @param {string} identifier - The value of the 'name' (e.g., 'description', 'keywords')
   * or 'property' (e.g., 'og:title', 'twitter:card') attribute.
   * @param {string} content - The new content for the meta tag.
   * @param {('name' | 'property')} [attributeKey='name'] - The attribute ('name' or 'property') used to identify the meta tag.
   */
  setMetaTag(identifier: string, content: string, attributeKey?: 'name' | 'property'): void;

  /**
   * Updates the canonical link URL.
   * If the canonical link does not exist, it will be created.
   *
   * @param {string} href - The canonical URL for the current page.
   */
  setCanonicalLink(href: string): void;

  /**
   * Updates the `lang` attribute of the `<html>` tag.
   * @param {SupportedLanguage['code']} langCode - The BCP 47 language code (e.g., 'en-US').
   */
  updateHtmlLang(langCode: SupportedLanguage['code']): void;

  /**
   * Sets or updates a generic link tag in the document head.
   * @param {string} rel - The 'rel' attribute of the link tag.
   * @param {string} href - The 'href' attribute of the link tag.
   * @param {Record<string, string>} [additionalAttributes] - Optional additional attributes for the link tag.
   */
  setLinkTag(rel: string, href: string, additionalAttributes?: Record<string, string>): void;
}

/**
 * Implements `ISeoService` for managing SEO-related elements in the DOM.
 * This class provides concrete implementations for updating titles, meta tags,
 * canonical links, and the HTML language attribute.
 * @class SeoService
 * @implements {ISeoService}
 */
class SeoService implements ISeoService {
  /** @inheritdoc */
  public setTitle(title: string): void {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }

  /** @inheritdoc */
  public setMetaTag(identifier: string, content: string, attributeKey: 'name' | 'property' = 'name'): void {
    if (typeof document === 'undefined') return;

    let element = document.querySelector<HTMLMetaElement>(`meta[${attributeKey}="${identifier}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attributeKey, identifier);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  }

  /** @inheritdoc */
  public setCanonicalLink(href: string): void {
    this.setLinkTag('canonical', href);
  }

  /** @inheritdoc */
  public updateHtmlLang(langCode: SupportedLanguage['code']): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', langCode);
    }
  }

  /** @inheritdoc */
  public setLinkTag(rel: string, href: string, additionalAttributes?: Record<string, string>): void {
    if (typeof document === 'undefined') return;

    let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (element) {
      element.setAttribute('href', href);
    } else {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      element.setAttribute('href', href);
      document.head.appendChild(element);
    }

    if (additionalAttributes) {
      for (const attr in additionalAttributes) {
        element.setAttribute(attr, additionalAttributes[attr]);
      }
    }
  }
}

/**
 * Singleton instance of the `SeoService`.
 * This instance provides a global point of access for SEO management functionalities.
 * @type {ISeoService}
 */
export const seoService: ISeoService = new SeoService();