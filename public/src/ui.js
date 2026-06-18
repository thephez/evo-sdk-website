import { elements, state } from './state.js';

export function setNoProofInfoVisibility(shouldShow) {
  if (!elements.noProofInfoContainer) return;
  elements.noProofInfoContainer.style.display = shouldShow ? 'block' : 'none';
}

export function setStatus(message, variant = 'loading') {
  if (!elements.statusBanner) return;
  elements.statusBanner.textContent = message;
  elements.statusBanner.className = `status-banner ${variant}`;
}

export function showPreloader(message = 'Loading...') {
  if (!elements.preloader) return;
  elements.preloader.style.display = 'flex';
  if (elements.preloaderText) elements.preloaderText.textContent = message;
}

export function hidePreloader() {
  if (!elements.preloader) return;
  elements.preloader.style.display = 'none';
}

export function setProgress(percent, message) {
  if (elements.progressFill) elements.progressFill.style.width = `${percent}%`;
  if (elements.progressPercent) elements.progressPercent.textContent = `${percent}%`;
  if (message && elements.preloaderText) elements.preloaderText.textContent = message;
}

export function showApiError(message) {
  if (elements.apiErrorBanner) {
    elements.apiErrorBanner.style.display = 'block';
  }
  if (elements.apiErrorMessage) {
    elements.apiErrorMessage.textContent = message;
  }
}

export function hideApiError() {
  if (elements.apiErrorBanner) {
    elements.apiErrorBanner.style.display = 'none';
  }
}

export function defaultResultMessage() {
  if (!elements.resultContent) return;
  elements.resultContent.classList.add('empty');
  elements.resultContent.classList.remove('error');
  elements.resultContent.textContent = 'No data fetched yet. Select a query category and type to begin.';
  state.currentResult = null;
}
