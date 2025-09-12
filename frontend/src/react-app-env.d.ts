

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_WEB3_PROVIDER_URL: string;
    REACT_APP_CONTRACT_ADDRESS: string;
    REACT_APP_IPFS_GATEWAY: string;
    REACT_APP_ENVIRONMENT: 'development' | 'staging' | 'production';
    REACT_APP_SENTRY_DSN?: string;
    REACT_APP_GOOGLE_MAPS_API_KEY?: string;
    REACT_APP_TWILIO_ACCOUNT_SID?: string;
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (accounts: string[]) => void) => void;
    removeListener: (eventName: string, callback: (accounts: string[]) => void) => void;
  };
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  gtag?: (...args: any[]) => void;
}

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

export {};