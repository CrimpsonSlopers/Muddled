import borders from "theme/base/borders";
import pxToRem from "theme/functions/pxToRem";

const { borderRadius } = borders;

const cardMedia = {
  styleOverrides: {
    root: {
      borderRadius: borderRadius.sm,
      margin: `${pxToRem(12)} ${pxToRem(12)} 0`,
    },

    media: {
      width: "auto",
    },
  },
};

export default cardMedia;
