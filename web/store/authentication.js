export const state = () => ({ userId: null, jwt: null });

export const mutations = {
    setUserId: function (state, userId) {
        state.userId = userId;
    },
    setJWT: function (state, jwt) {
        state.jwt = jwt;
    }
};

export const actions = {
    async logIn({ commit }, { postData }) {
        try {
            const { data } = await this.$axios.post(`${process.env.userApi}/users`, postData);
            commit('setUserId', data.payload.userId);
            commit('setJWT', data.payload.jwt);
            this.$axios.setToken(data.payload.jwt, 'Bearer');
        } catch (err) {
            throw new Error(err);
        }
    },
    resetAuth({ commit }) {
        commit('setUserId', null);
        commit('setJWT', null);
    }
}