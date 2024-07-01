const {Engine, Runner, Events} = Matter

export class EngineManager {
    constructor() {
        this._engine = Engine.create()
        this._runner = Runner.create()
    }

    get engine() {
        return this._engine
    }

    run() {
        Runner.run(this._runner, this._engine)
    }

    on(event, callback) {
        Events.on(this._engine, event, callback)
    }
}
