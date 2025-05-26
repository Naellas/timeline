
const timelineEl = document.getElementById('timelineContainer');
const form = document.getElementById('eventForm');
const nowMarker = document.getElementById('nowMarker');
let timelineData = [];

fetch('timeline.json')
  .then(res => res.json())
  .then(data => {
    const saved = JSON.parse(localStorage.getItem('timelineData'));
    timelineData = saved || data;
    renderTimeline();
  });

function renderTimeline() {
  timelineEl.querySelectorAll('.event').forEach(e => e.remove());

  const minDate = new Date(Math.min(...timelineData.map(e => new Date(e.date))));
  const maxDate = new Date(Math.max(...timelineData.map(e => new Date(e.date))));
  const totalMs = maxDate - minDate;
  const now = new Date();
  const containerWidth = timelineEl.scrollWidth;

  timelineData.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(event => {
    const eventDate = new Date(event.date);
    const percent = ((eventDate - minDate) / totalMs) * 100;

    const eventDiv = document.createElement('div');
    eventDiv.className = 'event' + (eventDate.toDateString() === now.toDateString() ? ' active' : '');
    eventDiv.style.left = `calc(${percent}% - 15px)`;
    eventDiv.style.position = 'absolute';
    eventDiv.innerHTML = `
      <div class="circle">${event.status}</div>
      <div class="label">${event.label}</div>
      <div class="label">${event.date}</div>
      <button onclick="editEvent('${event.date}')">✏️</button>
      <button onclick="deleteEvent('${event.date}')">🗑️</button>
    `;
    timelineEl.appendChild(eventDiv);
  });

  const nowPercent = ((now - minDate) / totalMs) * 100;
  nowMarker.style.left = `calc(${nowPercent}% - 1px)`;

  localStorage.setItem('timelineData', JSON.stringify(timelineData));
}

function editEvent(date) {
  const item = timelineData.find(e => e.date === date);
  if (item) {
    document.getElementById('date').value = item.date;
    document.getElementById('label').value = item.label;
    document.getElementById('status').value = item.status;
  }
}

function deleteEvent(date) {
  timelineData = timelineData.filter(e => e.date !== date);
  renderTimeline();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const label = document.getElementById('label').value;
  const status = document.getElementById('status').value;
  const index = timelineData.findIndex(e => e.date === date);
  if (index >= 0) timelineData[index] = { date, label, status };
  else timelineData.push({ date, label, status });
  renderTimeline();
  form.reset();
});
