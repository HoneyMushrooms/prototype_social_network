export default function (timeString) {
    if(!timeString) return '';
    const timeParts = timeString.split(":");
    const hours = timeParts[0].padStart(2, '0');
    const minutes = timeParts[1].padStart(2, '0');
    const currentDate = new Date();
    return `${hours}:${minutes} ${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
}