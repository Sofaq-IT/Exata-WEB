import {
  createStore
} from 'vuex';

export default createStore({
  state: {
    loading: false,
    isDark: false,
    authToken: null
  },
  mutations: {
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    setTheme(state, isDark) {
      state.isDark = isDark;
    },
    setToken(state, token) {
      state.authToken = token;
    },
  },
  actions: {
    showLoading({
      commit
    }) {
      commit('setLoading', true);
    },
    hideLoading({
      commit
    }) {
      commit('setLoading', false);
    },
    setDark({
      commit
    }) {
      commit('setTheme', true);
    },
    setLight({
      commit
    }) {
      commit('setTheme', false);
    }
  },
});
