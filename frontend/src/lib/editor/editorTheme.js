import { config } from "../../lib/store/store";
import { dracula } from "@ddietr/codemirror-themes/dracula";
import { materialLight } from '@ddietr/codemirror-themes/material-light';

export const editorTheme = () => {
  let theme;
  config.subscribe(cfg => {
    theme = cfg.theme === "dark" ? dracula : materialLight;
  });
  return theme;
};