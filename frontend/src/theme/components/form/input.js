import React from "react";

import typography from "../../base/typography";
import colors from "../../base/colors";

const { info, inputBorderColor, dark } = colors;
const { size } = typography;

const input = {
    styleOverrides: {
        root: {
            fontSize: size.lg,
            color: dark.main,

            "&:before": {
                borderColor: inputBorderColor,
            },

            "&:after": {
                borderColor: info.main,
            },
        },
    },
};

export default input;
