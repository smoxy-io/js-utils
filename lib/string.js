
export const capitalizeWords = (text) => {
    if (!text) {
        return text;
    }

    const words = text.split(' ');

    const res = [];

    for (const word of words) {
        if (!word) {
            res.push('');
            continue;
        }

        res.push(word[0].toUpperCase() + word.substring(1));
    }

    return res.join(' ');
};
