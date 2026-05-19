// Popup Script - Handle settings and UI interactions

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabledToggle');
  const autoSubmitToggle = document.getElementById('autoSubmitToggle');
  const soundToggle = document.getElementById('soundToggle');
  const statusDiv = document.getElementById('status');

  // Load settings
  chrome.storage.local.get(['enabled', 'autoSubmit', 'soundEnabled'], (result) => {
    const enabled = result.enabled !== false;
    const autoSubmit = result.autoSubmit !== false;
    const soundEnabled = result.soundEnabled !== false;

    updateToggleUI(enabledToggle, enabled);
    updateToggleUI(autoSubmitToggle, autoSubmit);
    updateToggleUI(soundToggle, soundEnabled);

    updateStatus(enabled);
  });

  // Toggle handlers
  enabledToggle.addEventListener('click', () => {
    const isNowEnabled = !enabledToggle.classList.contains('on');
    updateToggleUI(enabledToggle, isNowEnabled);
    chrome.storage.local.set({ enabled: isNowEnabled });
    updateStatus(isNowEnabled);
  });

  autoSubmitToggle.addEventListener('click', () => {
    const isNowEnabled = !autoSubmitToggle.classList.contains('on');
    updateToggleUI(autoSubmitToggle, isNowEnabled);
    chrome.storage.local.set({ autoSubmit: isNowEnabled });
  });

  soundToggle.addEventListener('click', () => {
    const isNowEnabled = !soundToggle.classList.contains('on');
    updateToggleUI(soundToggle, isNowEnabled);
    chrome.storage.local.set({ soundEnabled: isNowEnabled });
  });

  // Check if we're on IXL page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const isIXLPage = url && url.includes('ixl.com');
    
    if (!isIXLPage) {
      statusDiv.innerHTML = '<strong>⚠</strong> Not on IXL page. Navigate to ixl.com to use this extension.';
      statusDiv.classList.remove('active');
    }
  });
});

function updateToggleUI(toggle, isEnabled) {
  if (isEnabled) {
    toggle.classList.add('on');
  } else {
    toggle.classList.remove('on');
  }
}

function updateStatus(enabled) {
  const statusDiv = document.getElementById('status');
  if (enabled) {
    statusDiv.classList.add('active');
    statusDiv.innerHTML = '<strong>✓ Active</strong> - Solver is running on this tab';
  } else {
    statusDiv.classList.remove('active');
    statusDiv.innerHTML = '<strong>⊘ Paused</strong> - Solver is disabled';
  }
}
