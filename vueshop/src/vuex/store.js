export default {
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    //更新购物车信息
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    }
  }
}

