/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_STRAPI_URL?: string;
  readonly VITE_OPERATOR_NAME?: string;
  readonly VITE_OPERATOR_EMAIL?: string;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
