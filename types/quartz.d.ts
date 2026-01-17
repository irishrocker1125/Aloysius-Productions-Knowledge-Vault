/* TypeScript module declarations for Quartz */

// Type definitions for nominal types
type SlugLike<T extends string> = string & { __brand: T };
type FullSlug = SlugLike<"full">;

// SCSS module declarations
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

// Custom Window properties and events
declare global {
  interface CustomEventMap {
    nav: CustomEvent<{ url: FullSlug }>;
    prenav: CustomEvent<Record<string, never>>;
    themechange: CustomEvent<{ theme: "dark" | "light" }>;
    readermodechange: CustomEvent<{ mode: "on" | "off" }>;
  }

  interface Window {
    addCleanup(fn: () => void): void;
    spaNavigate(url: URL | FullSlug): void;
  }

  interface DocumentEventMap extends CustomEventMap {
    nav: CustomEventMap["nav"];
    prenav: CustomEventMap["prenav"];
    themechange: CustomEventMap["themechange"];
    readermodechange: CustomEventMap["readermodechange"];
  }
}

// Content data types
declare global {
  interface ContentDetails {
    title?: string;
    slug?: FullSlug;
    content?: string;
    tags?: string[];
    [key: string]: unknown;
  }

  type ContentIndex = { [key: string]: ContentDetails };

  function fetchData(): Promise<ContentIndex>;
}

export {};
