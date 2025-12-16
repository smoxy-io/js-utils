
export class Fetch {}

Fetch.Get = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: headers(url),
        credentials: 'include',
    }).then(handleResponse);
};

Fetch.Post = (url, body) => {
    return fetch(url, {
        method: 'POST',
        headers: headers(url, true),
        credentials: 'include',
        body: JSON.stringify(body)
    }).then(handleResponse);
};

Fetch.PostForm = (url, body) => {
    return fetch(url, {
        method: 'POST',
        headers: headers(url, true, true),
        credentials: 'include',
        body: body
    }).then(handleResponse);
}

Fetch.Put = (url, body) => {
    return fetch(url, {
        method: 'PUT',
        headers: headers(url, true),
        credentials: 'include',
        body: JSON.stringify(body)
    }).then(handleResponse);
}

Fetch.Delete = (url, body = null) => {
    let opts = {
        method: 'DELETE',
        headers: headers(url),
        credentials: 'include',
    };

    if (body) {
        opts.headers = headers(url, true);
        opts['body'] = JSON.stringify(body);
    }

    return fetch(url, opts).then(handleResponse);
};

function headers(url, hasBody = false, formData = false) {
    let headers = {
        Accept: 'application/json',
        'User-Agent': 'pooling-numbers-widget/v1',
        'Upgrade-Insecure-Requests': 1,
        'Accept-Encoding': 'gzip, deflate'
    };

    if (hasBody && !formData) {
        headers['Content-Type'] = 'application/json'
    }

    return headers;
}

function handleResponse(resp) {
    return resp.text().then((raw) => {
        let data = null;

        try {
            data = raw && JSON.parse(raw);
        } catch (e) {
            data = {success: false, resp: raw, parseError: e};
        }

        if (!resp.ok) {
            // if (AccessDeniedCodes.includes(resp.status)) {
            //     userService.logout();
            //
            // }
            return Promise.reject(new ResponseNotOkError((data && data.error) || resp.statusText, data));
        }

        return data;
    });
}

export class ResponseNotOkError extends Error {
    constructor(message, data) {
        super(message);
        this.name = 'ResponseNotOkError';
        this.data = data;
    }
}
