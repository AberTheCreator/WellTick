import { Web3Config, IPFSConfig } from "./web3";

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  web3: Web3Config;
  ipfs: IPFSConfig;
  ai: {
    apiKey: string;
    baseUrl: string;
    models: {
      chat: string;
      speechToText: string;
      textToSpeech: string;
      imageAnalysis: string;
    };
  };
  features: {
    enableWeb3: boolean;
    enableTelehealth: boolean;
    enableTokenRewards: boolean;
    enableAIAssistant: boolean;
  };
}
