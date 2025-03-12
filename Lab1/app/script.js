document.addEventListener('DOMContentLoaded', function() {
  const deploymentTime = new Date().toLocaleString();
  document.getElementById('deployment-time').textContent = deploymentTime;

  // Simulate container ID (in a real environment, this could be fetched from the container)
  const containerId = 'demo-' + Math.random().toString(36).substr(2, 9);
  document.getElementById('container-id').textContent = containerId;
  // Функция для отправки логов в Fluentd
  var form = new FormData();
  form.set('json', JSON.stringify({"foo": "bar"}));

  var req = new XMLHttpRequest();
  req.open('POST', 'http://localhost:24224/debug.log');
  req.send(form);
  function sendLogToFluentd(level, message) {
      fetch('http://localhost:24224/debug.log', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              level: level,
              message: message,
              timestamp: new Date().toISOString(),
              container_id: containerId
          })
      }).catch(err => console.error('Fluentd log error:', err));
  }
  // Function to add updates (can be used to demonstrate changes)
  function addUpdate(message) {
      const updates = document.getElementById('updates');
      const li = document.createElement('li');
      li.textContent = `${new Date().toLocaleString()}:${message}`;
      updates.insertBefore(li, updates.firstChild);
      sendLogToFluentd('info', message);
  }

  // Example of adding an update
  addUpdate('Application started');
  sendLogToFluentd('info', 'Application started');

  setInterval(() => {
      const logMessage = `Current time: ${new Date().toLocaleString()}`;
      addUpdate(logMessage);
      sendLogToFluentd('info', logMessage);
      fetch('http://localhost:24224/debug.log', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              level: logMessage,
              message: logMessage,
              timestamp: new Date().toISOString(),
              container_id: containerId
          })
      }).catch(err => console.error('Fluentd log error:', err));
  }, 5000); // 5000 мс = 5 секунд
});