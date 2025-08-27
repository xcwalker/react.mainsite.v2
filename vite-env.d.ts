interface ImportMetaEnv {
  readonly VITE_BUILD_DATE: string;
  readonly VITE_APP_VERSION: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}