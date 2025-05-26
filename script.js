
fetch('timeline.json')
  .then(response => response.json())
  .then(data => {
    const currentYear = new Date().getFullYear();
    const container = document.getElementById('timeline');
    data.forEach(item => {
      const event = document.createElement('div');
      event.className = 'event' + (item.year === currentYear ? ' active' : '');
      event.innerHTML = `
        <div class="circle">${item.year}</div>
        <div class="label">${item.status} ${item.label}</div>
      `;
      container.appendChild(event);
    });
  });
