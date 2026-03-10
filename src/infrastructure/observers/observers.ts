import { GymEvent, Observer } from "../../domain/events/events"

export const gymEmitter = {
  name: "gymEmitter",
  emit(observers: Observer[], event: GymEvent): void {
    console.log(`[${this.name}] Emitting: ${event.type}`)
    observers.forEach((obs) => obs(event))
  }
}