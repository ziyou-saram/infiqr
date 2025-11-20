// /eslint.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginImport from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;

const fileHeaderPlugin = {
  rules: {
    "path-comment": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Ensure files under src start with a comment containing their relative path",
        },
        fixable: "code",
        schema: [],
        messages: {
          missing:
            "File must begin with comment containing its relative path: {{ path }}",
        },
      },
      create(context) {
        const filename = context.filename ?? context.getFilename?.();
        if (!filename || filename === "<input>") {
          return {};
        }
        const relativePath = path.relative(projectRoot, filename);
        if (
          relativePath.startsWith("..") ||
          path.isAbsolute(relativePath) ||
          !relativePath ||
          !relativePath.replaceAll("\\", "/").startsWith("")
        ) {
          return {};
        }

        const normalizedPath = `/${relativePath.split(path.sep).join("/")}`;
        const expectedComment = `// ${normalizedPath}`;
        const sourceCode = context.sourceCode ?? context.getSourceCode?.();

        if (!sourceCode) {
          return {};
        }

        return {
          Program(node) {
            const text = sourceCode.getText();
            const match = text.match(/^\/\/[^\n]*(\r?\n)?/);

            if (match) {
              const commentValue = match[0].replace(/^\/\/\s*/, "").trim();
              if (commentValue === normalizedPath) {
                return;
              }
              context.report({
                node,
                messageId: "missing",
                data: { path: normalizedPath },
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [0, match[0].length],
                    `${expectedComment}\n`
                  );
                },
              });
              return;
            }

            context.report({
              node,
              messageId: "missing",
              data: { path: normalizedPath },
              fix(fixer) {
                return fixer.insertTextBeforeRange(
                  [0, 0],
                  `${expectedComment}\n`
                );
              },
            });
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "file-header": fileHeaderPlugin,
      import: eslintPluginImport,
      tailwindcss,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    settings: {
      tailwindcss: {
        config: {},
      },
    },
    rules: {
      "file-header/path-comment": "error",
      "tailwindcss/classnames-order": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react/"],
            ["^next(?:/|$)", "^node:"],
            ["^@/(?!components/ui)", "^~/", "^[./]"],
            ["^lucide(?:-react)?(?:/.*)?$"],
            ["^@/components/ui"],
            ["^@?\\w"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
