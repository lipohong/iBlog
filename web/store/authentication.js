export const state = () => ({ jwt: null });

export const mutations = {
    setJWT: function ( state, jwt ) {
        state.jwt = jwt;
    }
};

export const actions = {
    setJWT: ({ commit }, { jwt }) => {
        commit('setJWT', jwt);
    }
}