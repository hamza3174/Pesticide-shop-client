import { message } from "antd";

window.api = "https://pesticide-shop-server.vercel.app"

window.notify = (text, type) => {
    switch (type) {
        case "success":
            message.success(text)
            break;

        case "error":
            message.error(text)
            break;

        case "warning":
            message.warning(text)
            break;

        case "info":
            message.info(text)
            break;
    }

} 