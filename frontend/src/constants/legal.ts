/** Сведения об операторе для политики и футера. Задайте в .env перед публикацией. */

export const OPERATOR_NAME =
  import.meta.env.VITE_OPERATOR_NAME?.trim() || "Оператор сайта «Перевод сигналов животных»";

export const OPERATOR_EMAIL = import.meta.env.VITE_OPERATOR_EMAIL?.trim() || "privacy@example.com";

export const SESSION_STORAGE_KEY = "translator-session";
