
const timelineEl = document.getElementById('timeline');
const form = document.getElementById('eventForm');
let timelineData = [];

fetch('timeline.json')
  .then(res => res.json())
  .then(data => {
    const saved = JSON.parse(localStorage.getItem('timelineData'));
    timelineData = saved || data;
    renderTimeline();
  });

function renderTimeline() {
  timelineEl.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];
  timelineData.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(event => {
    const div = document.createElement('div');
    div.className = 'event' + (event.date === today ? ' active' : '');
    div.innerHTML = `
      <div><strong>${event.date}</strong></div>
      <div>${event.status} ${event.label}</div>
    `;
    timelineEl.appendChild(div);
  });
  localStorage.setItem('timelineData', JSON.stringify(timelineData));
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const label = document.getElementById('label').value;
  const status = document.getElementById('status').value;
  timelineData.push({ date, label, status });
  renderTimeline();
  form.reset();
});
