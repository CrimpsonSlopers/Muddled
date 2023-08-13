export function formatViewsLikes(number) {
    try {
        // 10,000,000+ => 10M
        if (Math.abs(number) >= 10000000) {
            return (number / 1000000).toFixed(0) + 'M';
        }

        // 1,000,000 - 10,000,000 => 1M
        if (Math.abs(number) >= 1000000) {
            return (number / 1000000).toFixed(2) + 'M';
        }

        // 1,000 - 1,000,000 => 1K
        if (Math.abs(number) >= 1000) {
            return (number / 1000).toFixed(0) + 'K';
        }
        return number;
    }
    catch (err) {
        console.error("Error: ", err);
        return number;
    }
}

export function formatPublished(date) {
    try {
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
    catch (err) {
        console.log("Error formatting published date: ", date)
        return date
    }
}

export function formatDuration(duration) {
    try {
        // Regular expressions to match different parts of the duration
        const hourRegex = /(\d+)H/;
        const minuteRegex = /(\d+)M/;
        const secondRegex = /(\d+)S/;

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        // Extract hours, minutes, and seconds using regular expressions
        const hourMatch = duration.match(hourRegex);
        if (hourMatch) {
            hours = parseInt(hourMatch[1]);
        }

        const minuteMatch = duration.match(minuteRegex);
        if (minuteMatch) {
            minutes = parseInt(minuteMatch[1]);
        }

        const secondMatch = duration.match(secondRegex);
        if (secondMatch) {
            seconds = parseInt(secondMatch[1]);
        }

        // Format hours, minutes, and seconds into HH:MM:SS
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        if (hourMatch) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    catch (err) {
        console.error("Error formatting duration: ", duration);
        return duration
    }

}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

export function formatStreamDate(timestamp) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    const date = new Date(timestamp);
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const day = date.getDate();
    const suffix = getDaySuffix(day);

    return days[ date.getDay() ] + ', ' + formattedDate.replace(day.toString(), `${day}${suffix}`);
}