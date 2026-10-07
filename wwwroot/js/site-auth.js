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
            }

            .stridex-auth-greeting{
                display:flex;
                align-items:center;
                padding:8px 4px;
                color:inherit;
                font-size:13px;
                font-weight:800;
                white-space:nowrap;
            }

            .header-action.auth-signup{
                padding:10px 14px;
                border-radius:8px;
                background:#7c3aed;
                color:#fff !important;
            }

            .header-action.auth-signup:hover{
                background:#5b21b6;
            }

            .header-action.auth-logout{
                cursor:pointer;
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
                top:0;
                right:0;
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
                .stridex-auth-greeting{
                    display:none;
                }

                .stridex-notification-panel{
                    right:-90px;
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

        const icon =
            document.createElement(
                "span"
            );

        icon.className =
            "action-icon";

        icon.textContent = "🔔";

        const label =
            document.createElement(
                "span"
            );

        label.textContent =
            "Notifications";

        button.append(
            icon,
            label
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

        const existingCart =
            actions.querySelector(
                ".cart-action"
            );

        let cart =
            existingCart;

        if (!cart) {
            cart =
                createLink(
                    "Cart",
                    "cart.html",
                    "cart-action"
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
        }

        cart.href =
            "cart.html";

        const count =
            cart.querySelector(
                ".cart-count"
            );

        if (
            count &&
            !count.id
        ) {
            count.id =
                "siteCartCount";
        }

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
                .split(/s+/)[0];

        const greeting =
            document.createElement(
                "span"
            );

        greeting.className =
            "stridex-auth-greeting";

        greeting.textContent =
            "Hi, " +
            firstName;

        const account =
            createLink(
                "My Account",
                "account.html"
            );

        const orders =
            createLink(
                "My Orders",
                "my-orders.html"
            );

        const notifications =
            await getNotifications();

        const notificationControl =
            createNotificationControl(
                notifications
            );

        const logout =
            createLink(
                "Log Out",
                "#",
                "auth-logout"
            );

        logout.addEventListener(
            "click",
            async function (event) {
                event.preventDefault();

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

        actions.append(
            greeting,
            account,
            orders,
            notificationControl,
            cart,
            logout
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