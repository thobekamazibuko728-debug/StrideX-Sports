(() => {
    "use strict";

    if (window.location.hostname !== "thobekamazibuko728-debug.github.io") {
        return;
    }

    const apiOrigin = "https://stridex-sports-production.up.railway.app";
    const originalFetch = window.fetch.bind(window);

    window.fetch = function (input, init) {
        const options = Object.assign({}, init || {});

        if (typeof input === "string" && input.startsWith("/api/")) {
            if (!("credentials" in options)) {
                options.credentials = "include";
            }

            return originalFetch(apiOrigin + input, options);
        }

        if (input instanceof Request) {
            const url = new URL(input.url);

            if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
                const target =
                    apiOrigin +
                    url.pathname +
                    url.search +
                    url.hash;

                const request = new Request(target, input);

                if (!("credentials" in options)) {
                    options.credentials = "include";
                }

                return originalFetch(request, options);
            }
        }

        return originalFetch(input, options);
    };

    window.STRIDEX_API_ORIGIN = apiOrigin;
})();
