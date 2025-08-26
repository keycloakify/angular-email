import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import calc from 'postcss-calc';
import properties from 'postcss-custom-properties';
import logical, { type DirectionFlow } from 'postcss-logical';
import preset from 'postcss-preset-env';

export const cssProcessor = async (style: string) => {
  try {
    const result = await postcss(
      tailwindcss(),
      properties({ preserve: false }),
      calc({ preserve: false }),
      {
        postcssPlugin: 'inline-tw-vars-from-layer',
        Once(root) {
          const defaultVars = new Map<string, string>();

          // 1. Find the default variables in @layer properties
          root.walkAtRules('layer', (layerRule) => {
            if (layerRule.params === 'properties') {
              layerRule.walkDecls(/^--tw-/, (decl) => {
                defaultVars.set(decl.prop, decl.value);
              });
            }
          });

          // 2. Walk all rules and replace var() usages
          root.walkDecls((decl) => {
            decl.value = decl.value.replace(/var\((--tw-[^,)]+)\)/g, (match, varName) => {
              return defaultVars.has(varName) ? defaultVars.get(varName)! : match;
            });
          });
        },
      },
      {
        postcssPlugin: 'remove-unused-tw-vars',
        Once(root) {
          root.walkDecls(/^--tw-/, (decl) => {
            decl.remove();
          });
          root.walkAtRules('property', (atRule) => {
            if (atRule.params.startsWith('--tw-')) {
              atRule.remove();
            }
          });
          root.walkAtRules('layer', (atRule) => {
            if (atRule.params === 'properties') {
              atRule.remove();
            }
          });
        },
      },
      logical({
        blockDirection: 'top-to-bottom' as DirectionFlow,
        inlineDirection: 'left-to-right' as DirectionFlow,
      }),
      preset({
        stage: 4,
        minimumVendorImplementations: 3,
        logical: {
          blockDirection: 'top-to-bottom' as DirectionFlow,
          inlineDirection: 'left-to-right' as DirectionFlow,
        },
      }),
    ).process(style, { map: false, from: undefined });
    return result.css;
  } catch (error) {
    console.error('CSS processing failed:', error);
    throw new Error(`Failed to process CSS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
