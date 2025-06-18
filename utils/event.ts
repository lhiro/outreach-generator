import mitt, { type Emitter } from 'mitt'

type IOnEvent = (...args: any[]) => () => void
interface IExtendedEmitter extends Emitter<any> {
  on: IOnEvent
}
const eventBus: IExtendedEmitter = mitt() as IExtendedEmitter

const on = eventBus.on
eventBus.on = (eventName, ...args): (() => void) => {
  on(eventName, ...args)
  return () => {
    eventBus.off(eventName, ...args)
  }
}
export {
  eventBus
}