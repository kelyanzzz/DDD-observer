import { Observer } from "../../domain/events/events"

export const databaseObserver: Observer = (event) => {
  console.log(`[DB] Saving to audit log: ${event.type}`)
}

export const trainerObserver: Observer = (event) => {
  if (event.type === "MemberCheckedIn") {
    console.log(`[Trainer] Member checked in — total visits: ${event.totalCheckIns}`)
  }
}

export const loggerObserver: Observer = (event) => {
  console.log(`[Logger] Event occurred: ${event.type}`)
}