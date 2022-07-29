chrome.runtime.onMessage.addListener((request, _sender, sendResp) => {
  const shouldRefresh = request.from === 'background' && request.action === 'refresh current page';
  if (shouldRefresh) {
    sendResp({ from: 'content script', action: 'reload extension' });
    // !: wait for plugin reload
    setTimeout(() => window.location.reload(), 100);
  }
});
