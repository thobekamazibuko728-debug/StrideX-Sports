(function () {
    "use strict";

    const API_BASE = "";
    let currentUser = null;

    function currentReturnTarget() {
        const file =
            window.location.pathname
                .split("/")
                .pop() ||
            "index.html";

        return (
            file +
            window.location.search +
            window.location.hash
        );
    }

    function accountUrl(mode, returnTarget) {
        const params =
            new URLSearchParams();

        params.set("mode", mode);

        if (returnTarget) {
            params.set(
                "return",
                returnTarget
            );
        }

        return (
            "account.html?" +
            params.toString()
        );
    }

    function createLink(
        text,
        href,
        extraClass
    ) {
        const link =
            document.createElement(
                "a"
            );

        link.href = href;
        link.className =
            "header-action" +
            (
                extraClass
                    ? " " + extraClass
                    : ""
            );

        const label =
            document.createElement(
                "span"
            );

        label.textContent = text;

        link.appendChild(label);

        return link;
    }

    function installStyles() {
        if (
            document.getElementById(
                "stridexAuthStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "stridexAuthStyles";

        style.textContent = `
            .header-actions.stridex-auth-ready{
                visibility:visible;
                align-items:center;
                gap:8px;
            }

            .header-actions .stridex-compact-action,
            .header-actions .stridex-account-button,
            .header-actions .stridex-notification-button{
                width:42px;
                height:42px;
                padding:0 !important;
                border:1px solid #e5e5ea !important;
                border-radius:12px;
                display:grid;
                place-items:center;
                background:#ffffff !important;
                color:#111111 !important;
                box-shadow:none !important;
                cursor:pointer;
                transition:.2s;
            }

            .header-actions .stridex-compact-action:hover,
            .header-actions .stridex-account-button:hover,
            .header-actions .stridex-notification-button:hover{
                border-color:#cfc2f8 !important;
                background:#f8f5ff !important;
                color:#6d28d9 !important;
            }

            .header-action.auth-signup{
                padding:10px 14px;
                border-radius:10px;
                border:1px solid #7c3aed;
                background:#7c3aed;
                color:#fff !important;
            }

            .header-action.auth-signup:hover{
                background:#5b21b6;
                border-color:#5b21b6;
            }

            .stridex-account-wrap{
                position:relative;
            }

            .header-actions .stridex-account-button{
                width:auto;
                min-width:0;
                padding:0 12px !important;
                grid-template-columns:auto auto auto;
                gap:8px;
                font:inherit;
                font-size:14px;
                font-weight:800;
                white-space:nowrap;
            }

            .stridex-avatar{
                width:28px;
                height:28px;
                border-radius:50%;
                display:grid;
                place-items:center;
                background:#efe7ff;
                color:#6d28d9;
                font-size:12px;
                font-weight:900;
            }

            .stridex-account-name{
                max-width:120px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }

            .stridex-chevron{
                color:#777;
                font-size:11px;
            }

            .stridex-account-menu{
                position:absolute;
                top:calc(100% + 10px);
                right:0;
                z-index:5000;
                min-width:190px;
                padding:8px;
                border:1px solid #e4e4e8;
                border-radius:12px;
                background:#ffffff;
                box-shadow:0 16px 40px rgba(0,0,0,.14);
            }

            .stridex-account-menu a,
            .stridex-account-menu button{
                width:100%;
                display:block;
                padding:11px 12px;
                border:0;
                border-radius:8px;
                background:transparent;
                color:#222;
                text-align:left;
                text-decoration:none;
                font:inherit;
                font-size:13px;
                font-weight:700;
                cursor:pointer;
            }

            .stridex-account-menu a:hover,
            .stridex-account-menu button:hover{
                background:#f5f0ff;
                color:#5b21b6;
            }

            .stridex-account-menu .logout-item{
                color:#a12638;
            }

            .stridex-notification-wrap{
                position:relative;
                display:flex;
                align-items:center;
            }

            .stridex-notification-button{
                position:relative;
                border:0;
                background:transparent;
                cursor:pointer;
                font:inherit;
            }

            .stridex-notification-badge{
                position:absolute;
                top:-7px;
                right:-7px;
                min-width:18px;
                height:18px;
                padding:0 5px;
                border-radius:999px;
                display:grid;
                place-items:center;
                background:#7c3aed;
                color:#fff;
                font-size:10px;
                font-weight:900;
            }

            .stridex-notification-panel{
                position:absolute;
                top:calc(100% + 10px);
                right:0;
                z-index:5000;
                width:min(360px,calc(100vw - 32px));
                max-height:420px;
                overflow:auto;
                padding:10px;
                border:1px solid #e4e4e8;
                border-radius:12px;
                background:#fff;
                box-shadow:0 16px 40px rgba(0,0,0,.15);
            }

            .stridex-notification-panel h3{
                margin:4px 6px 10px;
                color:#111;
                font-size:15px;
            }

            .stridex-notification-item{
                display:block;
                padding:11px 12px;
                border-radius:9px;
                color:#333;
                text-decoration:none;
                line-height:1.45;
                font-size:13px;
            }

            .stridex-notification-item:hover{
                background:#f5f0ff;
            }

            .stridex-notification-item strong{
                display:block;
                margin-bottom:3px;
                color:#5b21b6;
            }

            .stridex-notification-empty{
                margin:0;
                padding:12px;
                color:#666;
                font-size:13px;
            }

            @media(max-width:760px){
                .stridex-account-name{
                    display:none;
                }

                .header-actions .stridex-account-button{
                    width:42px;
                    padding:0 !important;
                    grid-template-columns:1fr;
                }

                .stridex-account-button .stridex-chevron{
                    display:none;
                }

                .stridex-notification-panel{
                    right:-70px;
                }
            }
        `;

        document.head.appendChild(
            style
        );
    }

    async function getUser() {
        try {
            const response =
                await fetch(
                    API_BASE +
                    "/api/auth/me",
                    {
                        credentials:
                            "include"
                    }
                );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch {
            return null;
        }
    }

    async function getNotifications() {
        if (!currentUser) {
            return [];
        }

        try {
            const [
                orderResponse,
                customResponse
            ] =
                await Promise.all([
                    fetch(
                        API_BASE +
                        "/api/orders",
                        {
                            credentials:
                                "include"
                        }
                    ),
                    fetch(
                        API_BASE +
                        "/api/custom-kits",
                        {
                            credentials:
                                "include"
                        }
                    )
                ]);

            const orders =
                orderResponse.ok
                    ? await orderResponse.json()
                    : [];

            const customKits =
                customResponse.ok
                    ? await customResponse.json()
                    : [];

            const notifications = [];

            (
                Array.isArray(orders)
                    ? orders
                    : []
            )
                .slice(0, 3)
                .forEach(
                    function (order) {
                        const status =
                            String(
                                order.status ||
                                "Processing"
                            );

                        let text =
                            "Order #" +
                            order.orderId +
                            " is " +
                            status.toLowerCase() +
                            ".";

                        if (
                            status.toLowerCase() ===
                            "delivered"
                        ) {
                            text =
                                "Order #" +
                                order.orderId +
                                " was delivered. Reorder is now available.";
                        }

                        notifications.push({
                            title:
                                "Order #" +
                                order.orderId,
                            text,
                            href:
                                "order-details.html?id=" +
                                order.orderId,
                            date:
                                order.orderDate ||
                                ""
                        });
                    }
                );

            (
                Array.isArray(customKits)
                    ? customKits
                    : []
            )
                .slice(0, 3)
                .forEach(
                    function (order) {
                        const normalized =
                            String(
                                order.status ||
                                "Pending"
                            )
                                .toLowerCase();

                        let text =
                            "Custom Kit #" +
                            order.customKitOrderId +
                            " is " +
                            normalized +
                            ".";

                        let href =
                            "custom-kit-order.html?id=" +
                            order.customKitOrderId;

                        if (
                            normalized ===
                            "pending"
                        ) {
                            text =
                                "Custom Kit #" +
                                order.customKitOrderId +
                                " is waiting for payment.";
                            href =
                                "custom-kit-payment.html?id=" +
                                order.customKitOrderId;
                        }

                        if (
                            normalized ===
                            "in production" ||
                            normalized ===
                            "processing"
                        ) {
                            text =
                                "Custom Kit #" +
                                order.customKitOrderId +
                                " is now in production.";
                        }

                        notifications.push({
                            title:
                                "Custom Kit #" +
                                order.customKitOrderId,
                            text,
                            href,
                            date:
                                order.createdAt ||
                                ""
                        });
                    }
                );

            notifications.sort(
                function (a, b) {
                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );
                }
            );

            return notifications
                .slice(0, 6);
        } catch {
            return [];
        }
    }

    function createSvgIcon(kind) {
        const namespace =
            "http://www.w3.org/2000/svg";

        const svg =
            document.createElementNS(
                namespace,
                "svg"
            );

        svg.setAttribute(
            "viewBox",
            "0 0 24 24"
        );

        svg.setAttribute(
            "width",
            "20"
        );

        svg.setAttribute(
            "height",
            "20"
        );

        svg.setAttribute(
            "aria-hidden",
            "true"
        );

        svg.setAttribute(
            "fill",
            "none"
        );

        svg.setAttribute(
            "stroke",
            "currentColor"
        );

        svg.setAttribute(
            "stroke-width",
            "1.8"
        );

        svg.setAttribute(
            "stroke-linecap",
            "round"
        );

        svg.setAttribute(
            "stroke-linejoin",
            "round"
        );

        const paths =
            kind === "bell"
                ? [
                    "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9",
                    "M10 21h4"
                ]
                : [
                    "M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6",
                    "M10 21a1 1 0 1 1 0-2",
                    "M18 21a1 1 0 1 1 0-2"
                ];

        paths.forEach(
            function (data) {
                const path =
                    document.createElementNS(
                        namespace,
                        "path"
                    );

                path.setAttribute(
                    "d",
                    data
                );

                svg.appendChild(
                    path
                );
            }
        );

        return svg;
    }

    function createCartControl() {
        const cart =
            document.createElement(
                "a"
            );

        cart.href = "cart.html";
        cart.className =
            "header-action cart-action stridex-compact-action";
        cart.setAttribute(
            "aria-label",
            "Cart"
        );
        cart.title = "Cart";

        cart.appendChild(
            createSvgIcon(
                "cart"
            )
        );

        const count =
            document.createElement(
                "span"
            );

        count.className =
            "cart-count";
        count.textContent = "0";

        cart.appendChild(
            count
        );

        return cart;
    }

    function createAccountControl(
        firstName
    ) {
        const wrap =
            document.createElement(
                "div"
            );

        wrap.className =
            "stridex-account-wrap";

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";
        button.className =
            "stridex-account-button";
        button.setAttribute(
            "aria-expanded",
            "false"
        );
        button.setAttribute(
            "aria-label",
            "Open account menu"
        );

        const avatar =
            document.createElement(
                "span"
            );

        avatar.className =
            "stridex-avatar";

        avatar.textContent =
            String(
                firstName ||
                "M"
            )
                .charAt(0)
                .toUpperCase();

        const name =
            document.createElement(
                "span"
            );

        name.className =
            "stridex-account-name";

        name.textContent =
            "Hi, " +
            firstName;

        const chevron =
            document.createElement(
                "span"
            );

        chevron.className =
            "stridex-chevron";

        chevron.textContent =
            "▼";

        button.append(
            avatar,
            name,
            chevron
        );

        const menu =
            document.createElement(
                "div"
            );

        menu.className =
            "stridex-account-menu";
        menu.hidden = true;

        const account =
            document.createElement(
                "a"
            );

        account.href =
            "account.html";
        account.textContent =
            "My Account";

        const orders =
            document.createElement(
                "a"
            );

        orders.href =
            "my-orders.html";
        orders.textContent =
            "My Orders";

        const logout =
            document.createElement(
                "button"
            );

        logout.type = "button";
        logout.className =
            "logout-item";
        logout.textContent =
            "Log Out";

        logout.addEventListener(
            "click",
            async function () {
                try {
                    await fetch(
                        API_BASE +
                        "/api/auth/logout",
                        {
                            method: "POST",
                            credentials:
                                "include"
                        }
                    );
                } finally {
                    currentUser = null;

                    window.dispatchEvent(
                        new CustomEvent(
                            "stridex-auth-changed"
                        )
                    );

                    window.location.href =
                        "index.html";
                }
            }
        );

        menu.append(
            account,
            orders,
            logout
        );

        button.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                menu.hidden =
                    !menu.hidden;

                button.setAttribute(
                    "aria-expanded",
                    String(
                        !menu.hidden
                    )
                );
            }
        );

        document.addEventListener(
            "click",
            function (event) {
                if (
                    !wrap.contains(
                        event.target
                    )
                ) {
                    menu.hidden = true;
                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        );

        wrap.append(
            button,
            menu
        );

        return wrap;
    }


    function createNotificationControl(
        notifications
    ) {
        const wrap =
            document.createElement(
                "div"
            );

        wrap.className =
            "stridex-notification-wrap";

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";
        button.className =
            "header-action stridex-notification-button";
        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.setAttribute(
            "aria-label",
            "Notifications"
        );
        button.title =
            "Notifications";

        button.appendChild(
            createSvgIcon(
                "bell"
            )
        );

        if (
            notifications.length > 0
        ) {
            const badge =
                document.createElement(
                    "span"
                );

            badge.className =
                "stridex-notification-badge";

            badge.textContent =
                String(
                    notifications.length
                );

            button.appendChild(
                badge
            );
        }

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "stridex-notification-panel";

        panel.hidden = true;

        const heading =
            document.createElement(
                "h3"
            );

        heading.textContent =
            "Order Updates";

        panel.appendChild(
            heading
        );

        if (
            notifications.length === 0
        ) {
            const empty =
                document.createElement(
                    "p"
                );

            empty.className =
                "stridex-notification-empty";

            empty.textContent =
                "No new order updates.";

            panel.appendChild(
                empty
            );
        } else {
            notifications.forEach(
                function (notification) {
                    const link =
                        document.createElement(
                            "a"
                        );

                    link.className =
                        "stridex-notification-item";

                    link.href =
                        notification.href;

                    const title =
                        document.createElement(
                            "strong"
                        );

                    title.textContent =
                        notification.title;

                    const text =
                        document.createElement(
                            "span"
                        );

                    text.textContent =
                        notification.text;

                    link.append(
                        title,
                        text
                    );

                    panel.appendChild(
                        link
                    );
                }
            );
        }

        button.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                panel.hidden =
                    !panel.hidden;

                button.setAttribute(
                    "aria-expanded",
                    String(
                        !panel.hidden
                    )
                );
            }
        );

        document.addEventListener(
            "click",
            function (event) {
                if (
                    !wrap.contains(
                        event.target
                    )
                ) {
                    panel.hidden = true;
                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        );

        wrap.append(
            button,
            panel
        );

        return wrap;
    }

    async function updateGlobalCartCount() {
        const counts =
            Array.from(
                document.querySelectorAll(
                    ".cart-count"
                )
            );

        if (
            counts.length === 0
        ) {
            return;
        }

        if (!currentUser) {
            counts.forEach(
                count =>
                    count.textContent =
                        "0"
            );
            return;
        }

        try {
            const response =
                await fetch(
                    API_BASE +
                    "/api/cart",
                    {
                        credentials:
                            "include"
                    }
                );

            if (!response.ok) {
                return;
            }

            const cart =
                await response.json();

            counts.forEach(
                count =>
                    count.textContent =
                        String(
                            cart.itemCount ||
                            0
                        )
            );
        } catch {
            // Page-specific cart loaders can still update the count.
        }
    }


    async function hydrateHeader() {
        installStyles();

        const actions =
            document.querySelector(
                ".header-actions"
            );

        if (!actions) {
            return;
        }

        const cart =
            createCartControl();

        actions.replaceChildren();

        if (!currentUser) {
            const login =
                createLink(
                    "Log In",
                    accountUrl(
                        "login",
                        currentReturnTarget()
                    )
                );

            const signup =
                createLink(
                    "Sign Up",
                    accountUrl(
                        "register",
                        currentReturnTarget()
                    ),
                    "auth-signup"
                );

            cart.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();

                    window.location.href =
                        accountUrl(
                            "login",
                            "cart.html"
                        );
                },
                {
                    once: true
                }
            );

            actions.append(
                login,
                signup,
                cart
            );

            actions.classList.add(
                "stridex-auth-ready"
            );

            return;
        }

        const firstName =
            String(
                currentUser.fullName ||
                "Member"
            )
                .trim()
                .split(/\s+/)[0];

        const accountControl =
            createAccountControl(
                firstName
            );

        const notifications =
            await getNotifications();

        const notificationControl =
            createNotificationControl(
                notifications
            );

        actions.append(
            accountControl,
            notificationControl,
            cart
        );

        actions.classList.add(
            "stridex-auth-ready"
        );
    }

    async function refresh() {
        currentUser =
            await getUser();

        await hydrateHeader();

        await updateGlobalCartCount();

        document.documentElement
            .classList.toggle(
                "stridex-logged-in",
                Boolean(currentUser)
            );

        document.documentElement
            .classList.toggle(
                "stridex-logged-out",
                !currentUser
            );

        return currentUser;
    }

    window.StrideXAuth = {
        refresh,
        get user() {
            return currentUser;
        },
        loginUrl: accountUrl
    };

    window.addEventListener(
        "stridex-auth-changed",
        function () {
            refresh();
        }
    );

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            refresh
        );
    } else {
        refresh();
    }
})();