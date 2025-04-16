import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertHours = (utcTime ) => {
    const vnTime = dayjs().utc(utcTime).tz("Asia/Ho_Chi_Minh").format("HH:mm");
    console.log("vnTime", vnTime);
    return vnTime;
}

