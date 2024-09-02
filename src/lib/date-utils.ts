const formatDate = (d: Date): string => {
    // format to YYY-MM-DD_HH-MM-SS
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();
    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

export { formatDate };