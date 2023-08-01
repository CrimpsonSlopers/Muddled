export function formatNumber(number) {
    return number
    // 10,000,000+
    if (Math.abs(number) >= 10000000) {
        return (number / 1000000).toFixed(0) + 'M';
    }

    // 1,000,000 - 10,000,000
    if (Math.abs(number) >= 1000000) {
        return (number / 1000000).toFixed(2) + 'M';
    }

    // 1,000 - 1,000,000
    if (Math.abs(number) >= 1000) {
        return (number / 1000).toFixed(0) + 'K';
    }

    return number
}

export function formatPublishedAt(date) {
    const now = new Date();
    const published = new Date(date)
    const timeDiff = Math.abs(now.getTime() - published.getTime());
    const monthDiff = Math.round(timeDiff / (30 * 24 * 60 * 60 * 1000));

    if (monthDiff > 12) {
        const yearDiff = Math.round(monthDiff / 12);
        return yearDiff + ' year' + (yearDiff > 1 ? 's' : '');
    }

    if (monthDiff < 1) {
        const dayDiff = Math.round(timeDiff / (24 * 60 * 60 * 1000));
        return dayDiff + ' day' + (dayDiff !== 1 ? 's' : '');
    }

    return monthDiff + ' month' + (monthDiff > 1 ? 's' : '');
}

export function formatDuration(timeString) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const hoursMatch = timeString.match(/(\d+)H/);
    const minutesMatch = timeString.match(/(\d+)M/);
    const secondsMatch = timeString.match(/(\d+)S/);

    if (hoursMatch) {
        hours = parseInt(hoursMatch[1]);
    }
    if (minutesMatch) {
        minutes = parseInt(minutesMatch[1]);
    }
    if (secondsMatch) {
        seconds = parseInt(secondsMatch[1]);
    }
    let formattedTime = "";

    if (hours > 0) {
        formattedTime += hours.toString() + ":";
    }

    formattedTime += minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    return formattedTime;
}