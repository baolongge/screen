import { createStore } from 'vuex'
import userInfo from './modules/user-info.js'

const store = createStore({
    state() {
        return {
            name: 'name'
        }
    },
    modules: {
        userInfo
    }
})

export default store
