import React from "react";
import colors from "../../base/colors";
import typography from "../../base/typography";

const { text } = colors;
const { size } = typography;

const inputLabel = {
    styleOverrides: {
        root: {
            fontSize: size.md,
            color: text.main,
            lineHeight: 0.9,

            "&.Mui-focused": {
                color: "#0E212E",
            },

            "&.MuiInputLabel-shrink": {
                lineHeight: 1.5,
                fontSize: size.md,

                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "1em",
                },
            },
        },

        sizeSmall: {
            fontSize: size.lg,
            lineHeight: 1.625,

            "&.MuiInputLabel-shrink": {
                lineHeight: 1.6,
                fontSize: size.lg,

                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "0.92em",
                },
            },
        },
    },
};

export default inputLabel;
