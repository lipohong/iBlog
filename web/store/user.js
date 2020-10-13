export const state = () => ({
    user: {
        _id: null,
        username: '',
        email: '',
        userInfo: {
            avatar: '',
            description: ''
        }
    }
});

export const mutations = {
    setUser: function ( state, user ) {
        state.user = user;
    }
};

export const actions = {
    setUser({ commit }, { user }) {
        commit('setUser', user);
    },
    resetUser({ commit }) {
        commit('setUser', {
            _id: null,
            username: '',
            email: '',
            userInfo: {
                avatar: '',
                description: ''
            }
        });
    },
    async getAndSetUserInfo({ commit }, { userId }) {
        try {
            const { data } = await this.$axios.get(`${process.env.userApi}/users/${userId}`);
            const { _id, username, email, userInfo } = data.payload;
            const user = { _id, username, email, userInfo };
            commit('setUser', user);
        } catch (err) {
            throw err;
        }
    }
}