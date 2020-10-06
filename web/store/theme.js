export const state = () => ({ theme: 1 });

export const mutations = {
    setTheme: function ( state, theme ) {
        state.theme = theme;
    }
};

export const actions = {
    setTheme: ({ commit }, { theme }) => {
        commit('setTheme', theme);
    }
}