import { pl } from '@formkit/i18n'
import { defaultConfig } from '@formkit/vue'
import { rootClasses } from '../formkit.theme.ts'

export default defaultConfig({
  locales: { pl },
  locale: 'pl',
  config: {
    rootClasses,
  },
})
