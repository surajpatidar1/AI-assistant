const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // disable explicit any rule
      "react/no-unescaped-entities": "error", // enforce escapes in JSX
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // warn, ignore _-prefixed
    }
  },
];
