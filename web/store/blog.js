export const state = () => ({ page: 1, perPage: 10, search: '', categories: [] });

export const mutations = {
    setPage: function ( state, page ) {
        state.page = page;
    },
    setSearch: function ( state, search ) {
        state.search = search;
    },
    setCategories: function ( state, categories ) {
        state.categories = categories;
    }
};

export const actions = {
    async searchBlog({ commit, state }, postData) {
        let { page, search, categories } = postData;
        page = page || state.page;
        search = search || state.search;
        categories = categories || state.search;
        let queries;
        if (page) {
            queries = `page=${page}&perPage=10`;
        }
        if (search) {
            queries = queries + `&search=${search}`;
        }
        if (categories && categories.length > 0) {
            queries = queries + `&categories=${categories.join(',')}`;
        }
        const { data } = await this.$axios.get(`${process.env.blogApi}/blogs/myBlogs?${queries}`);
        const { blogList, pagination } = data.payload;
        commit('setPage', pagination.currentPage);
        commit('setSearch', pagination.search);
        commit('setCategories', pagination.categories);

        return blogList;
    }
}