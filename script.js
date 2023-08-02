  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default "Add to Home Screen" prompt
    event.preventDefault();
    // Save the event for later use
    deferredPrompt = event;
    // Show your custom "Add to Home Screen" button or UI element
    // e.g., display a button that, when clicked, calls deferredPrompt.prompt()
  });

  // Function to handle the user's action to add the PWA to home screen
  function addToHomeScreen() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        }
        deferredPrompt = null;
      });
    }
  }
