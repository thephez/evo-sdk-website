import { SUPPORTED_INPUT_TYPES } from '../definitions.js';
import { elements, getDynamicHandler, state } from '../state.js';
import { normalizeType } from '../ui.js';

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

export function parseInputValue(type, def, control) {
  switch (type) {
    case 'number': {
      const raw = control.value.trim();
      if (!raw) {
        if (def.required) throw new Error(`${def.label || def.name} is required`);
        return null;
      }
      const val = Number(raw);
      if (Number.isNaN(val)) {
        throw new Error(`${def.label || def.name} must be a number`);
      }
      return val;
    }
    case 'checkbox':
      return control.checked;
    case 'json': {
      const raw = control.value.trim();
      if (!raw) {
        if (def.required) throw new Error(`${def.label || def.name} is required`);
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch (error) {
        throw new Error(`${def.label || def.name} must be valid JSON`);
      }
    }
    case 'array': {
      const raw = control.value.trim();
      if (!raw) {
        if (def.required) throw new Error(`${def.label || def.name} is required`);
        return [];
      }
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (_) {
        return raw.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    case 'multiselect': {
      const values = Array.from(control.selectedOptions).map(opt => opt.value);
      if (def.required && values.length === 0) {
        throw new Error(`${def.label || def.name} is required`);
      }
      return values;
    }
    case 'select': {
      const val = control.value;
      if (def.required && (val === '' || val === undefined || val === null)) {
        throw new Error(`${def.label || def.name} is required`);
      }
      return val;
    }
    case 'textarea':
    case 'text':
    default: {
      const raw = control.value.trim();
      if (!raw && def.required) {
        throw new Error(`${def.label || def.name} is required`);
      }
      return raw || null;
    }
  }
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

export function namedArgs(defs, args) {
  const out = {};
  defs.forEach((def, index) => {
    if (!def || !def.name) return;
    out[def.name] = args[index];
  });
  return out;
}
