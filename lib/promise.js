
export const fromCallback = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn(...args, (...cbArgs) => {
            if (cbArgs.length === 0) {
                return resolve();
            }

            const err = cbArgs.shift();

            if (err) {
                return reject(err);
            }

            resolve(...cbArgs);
        });
    });
};

export const fromCb = (fn, ...args) => {
    return fromCallback(fn, ...args);
};
