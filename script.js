const countrySelect = document.getElementById('countrySelect');
const calendar = document.getElementById('calendar');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const loading = document.getElementById('loading');
const monthYearDisplay = document.getElementById('monthYearDisplay');

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedCountry = 'US';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Populate dropdowns
months.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = month;
  if (index === currentMonth) option.selected = true;
  monthSelect.appendChild(option);
});

for (let y = 2000; y <= 2030; y++) {
  const option = document.createElement('option');
  option.value = y;
  option.textContent = y;
  if (y === currentYear) option.selected = true;
  yearSelect.appendChild(option);
}

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const updateMonthYearDisplay = () => {
  monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
};

const renderCalendar = (holidays = []) => {
  calendar.innerHTML = "";
  updateMonthYearDisplay();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(day => {
    const header = document.createElement('div');
    header.className = 'day header';
    header.textContent = day;
    calendar.appendChild(header);
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'day empty';
    calendar.appendChild(blank);
  }

  const days = daysInMonth(currentMonth, currentYear);
  for (let i = 1; i <= days; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isHoliday = holidays.find(h => h.date === dateStr);

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';

    const isToday = i === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear();
    if (isToday) dayDiv.classList.add('today');

    if (isHoliday) {
      dayDiv.classList.add('holiday');
      dayDiv.setAttribute('data-bs-toggle', 'tooltip');
      dayDiv.setAttribute('title', isHoliday.name);
      dayDiv.innerHTML = `<strong>${i}</strong><br><span>${isHoliday.name}</span>`;
    } else {
      dayDiv.textContent = i;
    }

    calendar.appendChild(dayDiv);
  }

  // Activate tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
};

const getHolidays = async (countryCode) => {
  loading.classList.remove('d-none');
  const apiKey = 'MRUPYH43BBzKYSCGir6mZ07U842qubj9';
  const url = `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${countryCode}&year=${currentYear}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.meta.code !== 200) throw new Error(data.meta.error_detail);

    const holidays = data.response.holidays.map(h => ({
      name: h.name,
      date: h.date.iso.split('T')[0]
    }));

    renderCalendar(holidays);
  } catch (error) {
    alert('❌ Error fetching holidays: ' + error.message);
    renderCalendar();
  } finally {
    loading.classList.add('d-none');
  }
};

// Event listeners
monthSelect.addEventListener('change', () => {
  currentMonth = parseInt(monthSelect.value);
  updateCalendar();
});

yearSelect.addEventListener('change', () => {
  currentYear = parseInt(yearSelect.value);
  updateCalendar();
});

countrySelect.addEventListener('change', (e) => {
  selectedCountry = e.target.value;
  updateCalendar();
});

function updateCalendar() {
  getHolidays(selectedCountry);
}

window.addEventListener('load', () => {
  getHolidays(selectedCountry);
});
