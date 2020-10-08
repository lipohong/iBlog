export const state = () => ({
    progressBar: false,
    snackBarOpen: false,
    snackBarMessage: '',
    snackBarColor: ''
});

export const mutations = {
    setProgressBar: function ( state, progressBar ) {
        state.progressBar = progressBar;
    },
    setSnackBar: function ( state, snackBar ) {
        state.snackBarOpen = snackBar.open;
        state.snackBarColor = snackBar.color;
        state.snackBarMessage = snackBar.message;
    },
};

export const actions = {
    setProgressBar: ({ commit }, { progressBar }) => {
        commit('setProgressBar', progressBar);
    },
    setSnackBar: ({ commit }, { snackBar }) => {
        commit('setSnackBar', snackBar);
    }
}