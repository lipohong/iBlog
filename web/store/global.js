export const state = () => ({ progressBar: false });

export const mutations = {
    setProgressBar: function ( state, progressBar ) {
        state.progressBar = progressBar;
    }
};

export const actions = {
    setProgressBar: ({ commit }, { progressBar }) => {
        commit('setProgressBar', progressBar);
    }
}