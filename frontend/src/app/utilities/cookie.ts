export function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; max-age=${maxAge}; domain=${
    process.env.NEXT_PUBLIC_ENV == "PROD" ? process.env.NEXT_PUBLIC_DOMAIN : "localhost"
  }; path=/; SameSite=Strict; Secure`;
}

