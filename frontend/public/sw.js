self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const title = data.title || 'New Notification';
      const options = {
        body: data.body || '',
        icon: '/logo.png', // Fallback icon
        badge: '/logo.png',
        vibrate: [100, 50, 100],
        data: {
          url: '/messages'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (e) {
      console.error('Error parsing push data', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      const targetUrl = event.notification.data.url || '/';
      
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
