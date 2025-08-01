import { DeepEvent, EventState, type Status, type TEvent } from './types'

export namespace Events {
  export function append(event: TEvent, next?: TEvent) {
    let evt = event.last || event
    while (evt.next != null) {
      evt = evt.next
    }
    evt.next = next
    event.last = next?.last || event.last || next
  }

  export function flatten(script: DeepEvent): TEvent {
    if (script == null) return {}
    if (typeof script === 'function') {
      return { init: script as () => void }
    }
    if (!Array.isArray(script)) {
      return script as TEvent
    }
    const events = (script as DeepEvent[]).map(flatten)
    if (events.length === 0) return {}
    for (let i = 0; i < events.length - 1; i++) {
      append(events[i]!, events[i + 1])
    }
    return events[0]!
  }

  export function wait(frames: number): TEvent {
    return { done: t => t >= frames }
  }

  export function changeHealth(
    status: Status,
    hpEnd: number,
    skipAnimation?: boolean
  ): TEvent {
    if (skipAnimation) {
      return {
        init: () => {
          status.hp = hpEnd
        },
      }
    }
    return {
      init: state => {
        state.hpStart = status.hp
        state.hpEnd = hpEnd
        state.duration = Math.abs(state.hpStart - hpEnd)
      },
      done: (t, state) => {
        const { duration, hpStart, hpEnd } = state
        const progress = t / duration
        status.hp = Math.floor(hpEnd * progress + hpStart * (1.0 - progress))
        return t >= duration
      },
    }
  }
}

export class EventDriver {
  private current?: TEvent

  // count number of ticks passed in current event
  private ticks: number = 0

  private readonly state: EventState

  constructor() {
    this.state = {
      waiting: false,
      hpStart: 0,
      hpEnd: 0,
      duration: 0,
      object: null,
      playerId: undefined,
      opponentId: undefined,
    }
  }

  update() {
    if (this.running()) {
      while (
        this.running() &&
        (!this.current!.done || this.current!.done(this.ticks, this.state))
      ) {
        this.setEvent(this.current!.next)
      }
      this.ticks++
    }
  }

  setEvent(event?: TEvent) {
    this.current = event
    this.ticks = 0
    if (event?.init != null) {
      event.init(this.state)
    }
  }

  append(event?: TEvent) {
    if (this.current == null) {
      this.setEvent(event)
    } else {
      Events.append(this.current, event)
    }
  }

  running(): boolean {
    return this.current != null
  }

  force(event: TEvent) {
    event.init!(this.state)
  }
}
