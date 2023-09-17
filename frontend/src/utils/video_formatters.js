export function formatViewsLikes(number) {
    try {
        // 10,000,000+ => 10M
        if (Math.abs(number) >= 10000000) {
            return (number / 1000000).toFixed(0) + "M";
        }

        // 1,000,000 - 10,000,000 => 1M
        if (Math.abs(number) >= 1000000) {
            return (number / 1000000).toFixed(2) + "M";
        }

        // 1,000 - 1,000,000 => 1K
        if (Math.abs(number) >= 1000) {
            return (number / 1000).toFixed(0) + "K";
        }
        return number;
    } catch (err) {
        console.error("Error: ", err);
        return number;
    }
}

export function formatPublished(date) {
    try {
        const now = new Date();
        const published = new Date(date);
        const timeDiff = Math.abs(now.getTime() - published.getTime());
        const monthDiff = Math.round(timeDiff / (30 * 24 * 60 * 60 * 1000));

        if (monthDiff > 12) {
            const yearDiff = Math.round(monthDiff / 12);
            return yearDiff + " year" + (yearDiff > 1 ? "s" : "");
        }

        if (monthDiff < 1) {
            const dayDiff = Math.round(timeDiff / (24 * 60 * 60 * 1000));
            return dayDiff + " day" + (dayDiff !== 1 ? "s" : "");
        }

        return monthDiff + " month" + (monthDiff > 1 ? "s" : "");
    } catch (err) {
        console.log("Error formatting published date: ", date);
        return date;
    }
}

export function formatDuration(seconds) {
    try {
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;

        // Format the result based on the presence of hours
        let formattedTime = "";

        if (hours > 0) {
            const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
            formattedTime += `${formattedHours}:`;
        }

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = secs < 10 ? `0${secs}` : `${secs}`;

        formattedTime += `${formattedMinutes}:${formattedSeconds}`;

        return formattedTime;
    } catch (err) {
        console.error("Error formatting duration: ", seconds);
        return seconds;
    }
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

export function formatStreamDate(timestamp) {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const day = date.getDate();
    const suffix = getDaySuffix(day);

    return formattedDate.replace(day.toString(), `${day}${suffix}`);
}
