import colors from "theme/base/colors";
import borders from "theme/base/borders";

import rgba from "theme/functions/rgba";

const { black, white } = colors;
const { borderWidth, borderRadius } = borders;

const card = {
    styleOverrides: {
        root: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: 0,
            wordWrap: "break-word",
            backgroundColor: white.main,
            backgroundClip: "border-box",
            border: `1px solid ${rgba(black.main, 0.125)}`,
            borderRadius: "8px",
            boxShadow: none,
            padding: "16px 12px"
        },
    },
};

export default card;
