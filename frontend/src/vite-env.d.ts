/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT?: string;
  readonly VITE_APPWRITE_PROJECT_ID?: string;
  readonly VITE_APPWRITE_PROJECT_NAME?: string;
  readonly VITE_APPWRITE_BUCKET_ID?: string;
  readonly VITE_APPWRITE_DATABASE_ID?: string;
  readonly VITE_APPWRITE_IMAGE_COLLECTION_ID?: string;
  readonly NEXT_PUBLIC_APPWRITE_ENDPOINT?: string;
  readonly NEXT_PUBLIC_APPWRITE_PROJECT_ID?: string;
  readonly NEXT_PUBLIC_APPWRITE_BUCKET_ID?: string;
  readonly NEXT_PUBLIC_APPWRITE_DATABASE_ID?: string;
  readonly NEXT_PUBLIC_APPWRITE_IMAGE_COLLECTION_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
