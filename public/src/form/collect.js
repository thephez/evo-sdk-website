import { SUPPORTED_INPUT_TYPES, normalizeType } from '../input-types.js';
import { parseInputValue } from './parse-input.js';
import { elements, getDynamicHandler, state } from '../state.js';

// Re-export the pure parsing helpers so existing importers of './collect.js'
// keep working. New code can import them directly from './parse-input.js'.
export { parseInputValue, namedArgs } from './parse-input.js';

export function collectArgs(definition) {
  const defs = Array.isArray(definition.inputs) ? definition.inputs : [];
  return defs.map((inputDef, index) => {
    const type = normalizeType(inputDef.type);
    if (!SUPPORTED_INPUT_TYPES.has(type)) return undefined;
    if (type === 'button' || type === 'keyPreview') {
      return undefined;
    }
    if (type === 'dynamic') {
      const handler = getDynamicHandler(inputDef.name || `param_${index}`);
      if (!handler || typeof handler.collect !== 'function') {
        if (inputDef.required) {
          throw new Error(`Missing required input: ${inputDef.label || inputDef.name || `Parameter ${index + 1}`}`);
        }
        return undefined;
      }
      return handler.collect(state.selected?.operationKey || null);
    }
    const selector = `[data-input-name="${inputDef.name || `param_${index}`}"]`;
    const control = elements.dynamicInputs.querySelector(selector);
    if (!control) {
      if (inputDef.required) {
        throw new Error(`Missing required input: ${inputDef.label || inputDef.name || `Parameter ${index + 1}`}`);
      }
      return undefined;
    }
    if (control.closest('.input-group')?.style.display === 'none') {
      return undefined;
    }
    return parseInputValue(type, inputDef, control);
  });
}

export function getInputElement(name) {
  return elements.dynamicInputs?.querySelector(`[data-input-name="${name}"]`);
}

export function getInputValue(name) {
  const element = getInputElement(name);
  if (!element) return '';
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    const raw = element.value;
    return typeof raw === 'string' ? raw.trim() : raw;
  }
  return '';
}
