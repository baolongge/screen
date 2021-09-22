const state = {
    userId: '1',
    userName: '2',
  }
  const actions = {
    setUserInfo ({
      state
    },
    data
    ) {
      state.userId = data.userId
      state.userName = data.userName
    }
  }
  const getters = {

  }
  export default {
    state,
    actions,
    getters
  }