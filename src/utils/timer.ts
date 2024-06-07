export const timerFromTimestamp = (timestamp: number) => {
    const nowTimestamp = new Date().getTime();

    const secs = (timestamp - nowTimestamp) / 1000;

    if (secs < 0) {
        return {
            'd': 0,
            "h": 0,
            "m": 0,
            "s": 0,
        }
    }

    let days = Math.floor(secs / (60 * 60 * 24));
    let divisor_for_hours = secs % (60 * 60 * 24)
    let hours = Math.floor(divisor_for_hours / (60 * 60));
    let divisor_for_minutes = divisor_for_hours % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
        'd': days,
        "h": hours,
        "m": minutes,
        "s": seconds,
    };

    return obj;
}