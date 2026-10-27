import { writable, get } from 'svelte/store';

// One panel for the whole guide: which quote it shows and which ones the open step cites.
// Each request to open counts up, so the panel takes focus then and not when a step change
// swaps its quote.
export const lawPanel = writable({ open: false, active: null, ids: [], request: 0 });

let opener = null;

// A marked citation inside an answer card is text, so focus returns to the card itself.
function focusable(element) {
  if (!element?.isConnected) return null;
  if (element.matches('a, button')) return element;
  const card = element.closest('button, label');
  return card?.matches('label') ? card.querySelector('input') : card;
}

// Switching quotes inside the panel keeps the control that first opened it.
export function openLaw(id, from) {
  if (from !== undefined) opener = from;
  lawPanel.update(state => ({ ...state, open: true, active: id || state.ids[0] || null, request: state.request + 1 }));
}

export function closeLaw() {
  if (!get(lawPanel).open) return;
  lawPanel.update(state => ({ ...state, open: false }));
  focusable(opener)?.focus({ preventScroll: true });
  opener = null;
}

// Moving to another step keeps an open panel on the law that step cites, or closes it.
export function setLawIds(ids) {
  const state = get(lawPanel);
  if (ids.join() === state.ids.join()) return;
  const active = ids.includes(state.active) ? state.active : ids[0] || null;
  if (!active) opener = null;
  lawPanel.set({ ...state, open: state.open && Boolean(active), active, ids });
}
