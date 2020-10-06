import colors from 'vuetify/lib/util/colors';

const dark = {
    primary: colors.grey.darken1,
    secondary: colors.grey.lighten1,
    accent: colors.shades.white,
    error: colors.red.accent4,
}

export default [
    {
        light: {
            primary: colors.blue.darken1,
            secondary: colors.blue.lighten1,
            accent: colors.shades.black,
            error: colors.red.accent3,
        },
        dark
    },
    {
        light: {
            primary: colors.green.darken1,
            secondary: colors.green.lighten1,
            accent: colors.shades.black,
            error: colors.red.accent3,
        },
        dark
    },
    {
        light: {
            primary: colors.orange.darken1,
            secondary: colors.orange.lighten1,
            accent: colors.shades.black,
            error: colors.red.accent3,
        },
        dark
    }
]