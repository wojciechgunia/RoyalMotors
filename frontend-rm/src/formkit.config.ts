import { en } from '@formkit/i18n'
import { defaultConfig } from '@formkit/vue'
import { rootClasses } from '../formkit.theme.ts'
import { createMultiStepPlugin } from '@formkit/addons'
import '@formkit/addons/css/multistep'

export default defaultConfig({
  locales: { en },
  locale: 'en',
  config: {
    rootClasses,
  },
  plugins: [createMultiStepPlugin()],
})
