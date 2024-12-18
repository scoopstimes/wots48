self.addEventListener('push', function(event) {
  let options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'badge.png'
  };

  event.waitUntil(
    self.registration.showNotification('Live Notification', options)
  );
});