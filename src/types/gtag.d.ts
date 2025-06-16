declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
        page_title?: string;
        page_location?: string;
        user_id?: string;
        custom_map?: { [key: string]: string };
      }
    ) => void;
  }
  
  function gtag(
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: {
      [key: string]: any;
      page_title?: string;
      page_location?: string;
      user_id?: string;
      custom_map?: { [key: string]: string };
    }
  ): void;
}

export {}; 