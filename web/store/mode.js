export const state = () => ({ mode: 'light' });

export const mutations = {
    setMode: function ( state, mode ) {
        state.mode = mode;
    }
};

export const actions = {
    setMode: ({ commit }, { mode }) => {
        commit('setMode', mode);
    }
}