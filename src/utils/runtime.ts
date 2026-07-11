import { type PropType, warn } from 'vue';

interface PropOptions {
  type: any;
  default?: any;
  values?: readonly any[];
}

export const definePropType = <T>(val: any): PropType<T> => val;

export const buildProps = (propsConfig: Record<string, PropOptions>) => {
  const result: any = {};
  for (const key in propsConfig) {
    const config = propsConfig[key];

    if (config && config.values) {
      result[key] = {
        type: config.type,
        default: config.default,
        validator: (val: any) => {
          const valid = config.values!.includes(val);
          if (!valid) {
            warn(
              `Invalid prop: "${key}" received invalid value "${val}". Expected one of: ${config.values!.join(', ')}`
            );
          }
          return valid;
        },
      };
    } else {
      result[key] = config;
    }
  }
  return result;
};
