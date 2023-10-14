// Soft UI Dashboard React Base Styles
import colors from "./colors"

const { info, dark } = colors;

const globals = {
    html: {
        scrollBehavior: "smooth",
        color: "#0E212E"
    },
    "*, *::before, *::after": {
        margin: 0,
        padding: 0,
    },
    "a, a:link, a:visited": {
        textDecoration: "none !important",
    },
    "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
        color: `#0E212E !important`,
        transition: "color 150ms ease-in !important",
    },
    "a.link:hover, .link:hover, a.link:focus, .link:focus": {
        color: `#0E212E !important`,
    },
    "svg": {
        textAlign: "center",
        verticalAlign: "middle",
    }
};

export default globals;
