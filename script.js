document.addEventListener('DOMContentLoaded', () => {
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const currentMonthYear = document.getElementById('current-month-year');
    const calendarGrid = document.getElementById('calendar-grid');

    let currentDate = new Date();
    let hijriOffset = -354; // Adjusted Hijri offset to make Rajab start at January 1

    function renderCalendar() {
        calendarGrid.innerHTML = '';

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        const options = { day: 'numeric', month: 'short', year: 'numeric' };

        // Format the day of the week in Bahasa Indonesia
        const dayOptions = { weekday: 'long', locale: 'id-ID' };

        // Format the month name in Bahasa Indonesia
        const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(currentDate);

        currentMonthYear.textContent = `${monthName} ${currentDate.getFullYear()}`;

        for (let i = 0; i < firstDay; i++) {
            calendarGrid.innerHTML += '<div class="empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const gregorianDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            const hijriDate = new Date(gregorianDate);
            hijriDate.setDate(hijriDate.getDate() + hijriOffset);

            const hijriOptions = { calendar: 'islamic', day: 'numeric', month: 'short' };
            const gregorianOptions = { day: 'numeric', month: 'short' };

            const summaryDate = new Intl.DateTimeFormat('en-TN', gregorianOptions).format(gregorianDate);

            const fullDate = new Intl.DateTimeFormat('en-TN', { ...gregorianOptions, year: 'numeric' }).format(gregorianDate);

            // Format the day of the week in Bahasa Indonesia
            const dayOfWeek = new Intl.DateTimeFormat('id-ID', dayOptions).format(gregorianDate);

            calendarGrid.innerHTML += `
                <div class="calendar-cell" title="${fullDate}">
                    <span class="day-of-week">${dayOfWeek}</span>
                    <span class="date">${day}</span>
                    <span class="hijri-summary">(${new Intl.DateTimeFormat('en-TN-u-ca-islamic', hijriOptions).format(hijriDate)})</span>
                </div>`;
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});