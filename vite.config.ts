import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * temml builds its lexer regex from a string concatenation that contains lone
 * UTF-16 surrogate escapes ("[\uD800-\uDBFF][\uDC00-\uDFFF]"). When the
 * bundler folds that concatenation into a template literal it writes the
 * lone surrogates out as U+FFFD, which turns the surrogate-pair class into a
 * range that matches almost anything, and "\mathrm" then lexes as "\m".
 * Escaping the backslashes keeps the source ASCII; RegExp still reads the
 * \uXXXX escapes itself, so the behavior is unchanged.
 */
function temmlSurrogateFix(): Plugin {
  const from = '"|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]"'
  const to = '"|[\\\\uD800-\\\\uDBFF][\\\\uDC00-\\\\uDFFF]"'
  return {
    name: 'temml-surrogate-fix',
    enforce: 'pre',
    transform(code, id) {
      if (!/[\\/]temml[\\/]dist[\\/]temml\.(mjs|cjs|js)$/.test(id)) return null
      if (!code.includes(from)) this.error('temml-surrogate-fix: expected lexer pattern not found; check the temml version')
      return { code: code.replace(from, to), map: null }
    },
  }
}

export default defineConfig({
  base: '/hemodynamics/',
  plugins: [temmlSurrogateFix(), react(), tailwindcss()],
  // Served through the plugin pipeline in development so the fix applies.
  optimizeDeps: { exclude: ['temml'] },
})
