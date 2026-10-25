import { mount } from 'svelte';
import App from '../../packages/privacy-guides/src/App.svelte';
import { explanations } from '/explanation-annotations.js';

// This page shares portfolio navigation, assets and optional analytics. Mounting
// the decision UI does not replace the host's fetch/clipboard/network APIs.
const status = document.getElementById('guide-loading');
try {
  mount(App, { target: document.getElementById('privacy-guides-app') });
  document.getElementById('privacy-guides-app').addEventListener('keydown', event => {
    const group = event.target.closest('[role="radiogroup"]');
    if (!group || !['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const choices = [...group.querySelectorAll('[role="radio"]')], index = choices.indexOf(event.target);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 :
      (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + choices.length) % choices.length;
    choices[next].click(); choices[next].focus();
  });
  status.hidden = true;
  explanations.start(document.querySelector('main'));
} catch (error) {
  status.textContent = 'The guides could not load. Reload this page to try again.';
  status.setAttribute('role', 'alert');
  console.error('Privacy Decision Guides failed to mount.', error);
}
