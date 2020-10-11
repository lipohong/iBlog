import * as Cookies from 'js-cookie';

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
            const { userId, jwt } = data.payload;
            commit('setUserId', userId);
            commit('setJWT', jwt);
            this.$axios.setToken(jwt, 'Bearer');
            // set cookies for auto log in
            Cookies.set('authentication', JSON.stringify({ userId, jwt }), { path: '/' });
        } catch (err) {
            throw new Error(err);
        }
    },
    async setAuth({ commit }, { authentication }) {
        commit('setUserId', authentication.userId);
        commit('setJWT', authentication.jwt);
    },
    resetAuth({ commit }) {
        commit('setUserId', null);
        commit('setJWT', null);
    }
}