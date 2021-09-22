
const listeners = function(cb) {
	setTimeout(() => {
		window.addEventListener("storage", cb)
	}, 0)
}
const local = window.localStorage
const EMITTER_KEY = "_emitter"
const record = {}
export default class EventEmitter {
	handleEvent = {}
	constructor(event = "_events") {
		this.event = event
	}
	on(type, handler) {
		let namespace = `${this.event}.${type}`
		if(!this.handleEvent.hasOwnProperty(namespace)) this.handleEvent[namespace] = []
		this.handleEvent[namespace].push(handler)
		this.init(namespace)
	}
	init(namespace) {
		local.setItem(EMITTER_KEY, JSON.stringify({
			[namespace]: { 
				msg:":init",
				timestamp:Date.now()
			}
		}))
	}
	emit(type, params) {
		let namespace = `${this.event}.${type}`
		local.setItem(EMITTER_KEY, JSON.stringify({
			[namespace]: {
				msg:params,
				timestamp:Date.now()
			}
		}))
		listeners((ev) => {
			if(ev.key === EMITTER_KEY) {
				if(!this.handleEvent[namespace]) return
				if(record[namespace]) record[namespace] = 0
				this.handleEvent[namespace].forEach(fn => {
					if(!record[namespace]) {		//确保监听多个只能执行一次
						fn({
							ctx:this,
							key:ev.key,
							newValue:JSON.parse(ev.newValue),
							oldValue:JSON.parse(ev.oldValue),
							url:ev.url,
							namespace:namespace
						})
						record[namespace] = 1
						return
					}
				})
			}
		})
	}
	clear() {
		local.removeItem(EMITTER_KEY)
		this.handleEvent = {}
	}
	remove(type, handler) {
		let namespace = `${this.event}.${type}`
		if(!this.handleEvent.hasOwnProperty(namespace)) return 	//没有类型返回
		if(!handler) delete this.handleEvent[namespace] //没有传事件 直接把类型删除
		else {
			const index = this.handleEvent[namespace].findIndex(ele => ele === handler)
			if(!index) return
			this.handleEvent[namespace].splice(index, 1)
			if (this.handleEvent[namespace].length === 0) {
				delete this.handleEvent[namespace]
			}
		}
	}
}