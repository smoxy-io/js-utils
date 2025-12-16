import {format} from "date-fns";

export const formatTime = (date) => {
    return format(date, 'MM/dd/yyyy h:mma');
};

export const getTime = (timestamp) => {
    return new Date(timestamp * 1000);
};

export const formatDate = (date) => {
    return format(date, 'MM/dd/yyyy');
}
