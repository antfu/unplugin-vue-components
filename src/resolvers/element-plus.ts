import { ComponentResolver, SideEffectsInfo } from '../types'
import { kebabCase } from '../utils'

export interface ElementPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * specify element-plus version to load style
   *
   * @default 1.0.2
   */
  version?: string
}

/**
 * @deprecated
 * @param partialName
 * @param options
 *
 * @returns
 */
function getSideEffectsLagency(
  partialName: string,
  options: ElementPlusResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options
  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'element-plus/packages/theme-chalk/src/base.scss',
      `element-plus/packages/theme-chalk/src/${partialName}.scss`,
    ]
  }
  else if (importStyle === true || importStyle === 'css') {
    return [
      'element-plus/lib/theme-chalk/base.css',
      `element-plus/lib/theme-chalk/el-${partialName}.css`,
    ]
  }
}

function getSideEffects(dirName: string, options: ElementPlusResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options

  if (importStyle === 'sass')
    return `element-plus/es/components/${dirName}/style`

  else if (importStyle === true || importStyle === 'css')
    return `element-plus/es/components/${dirName}/style/css`
}

/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 *
 * @author @develar @nabaonan
 * @link https://element-plus.org/#/en-US for element-plus
 *
 */
export function ElementPlusResolver(
  options: ElementPlusResolverOptions = {},
): ComponentResolver {
  return (name: string) => {
    const { version = '1.0.2' } = options

    if (name.match(/^El[A-Z]/)) {
      let sideEffects
      const partialName = kebabCase(name.slice(2))// ElTableColumn->table-column
      if (version >= '1.1.0') {
        sideEffects = getSideEffects(partialName, options)
        return {
          importName: name,
          path: 'element-plus/es',
          sideEffects,
        }
      }
      else if (version >= '1.0.2') {
        sideEffects = getSideEffectsLagency(partialName, options)
        return {
          path: `element-plus/es/el-${partialName}`,
          sideEffects,
        }
      }
      else {
        // for 1.0.1
        sideEffects = getSideEffectsLagency(partialName, options)
        return {
          path: `element-plus/lib/el-${partialName}`,
          sideEffects,
        }
      }
    }
  }
}
