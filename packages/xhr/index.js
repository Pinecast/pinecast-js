var xhr = require("xhr");


var CSRF_TOKEN = '';
if (typeof document !== 'undefined') {
    var csrfMeta = document.querySelector('meta[name=csrf]');
    if (csrfMeta) {
        CSRF_TOKEN = csrfMeta.getAttribute('content');
    }
}

module.exports = function pinecastXHR(origOptions, callback) {
    var opts = {};
    for (var k in origOptions) {
        opts[k] = origOptions[k];
    }
    opts.headers = opts.headers || {};
    if (!origOptions.noCSRFToken) {
        opts.headers['X-CSRFToken'] = CSRF_TOKEN;
    }

    if (origOptions.form) {
        var body = Object.keys(origOptions.form)
            .sort()
            .map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(origOptions.form[key]);
            })
            .join('&');
        opts.body = body;
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return xhr(opts, callback);
};

module.exports.setCSRF = function setCSRF(token) {
    CSRF_TOKEN = token;
};
