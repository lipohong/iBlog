const defaultSettings = {
    success: "#4CAF50",  // green
    warning: "#FB8C00",  // orange darken-1
    error: "#FF5252",  // red accent-2
    info: "#2196F3",  // blue
    accent: "#82B1FF"  // blue accent-1
}

export const dark = {
    primary: "#424242",  // grey darken-3
    secondary: "#757575",  // grey darken-1
    ...defaultSettings
}

export const light = [
    {
        primary: "#1565C0",  // blue darken-3
        secondary: "#1E88E5"  // blue darken-1
    },
    {
        primary: "#00695C",  // teal darken-3
        secondary: "#00897B"  // teal darken-1
    },
    {
        primary: "#4E342E",  // brown darken-3
        secondary: "#6D4C41"  // brown darken-1
    },
].map((item) => ({
    ...item,
    ...defaultSettings
}))
