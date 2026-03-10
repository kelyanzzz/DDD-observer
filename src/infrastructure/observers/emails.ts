import { Observer } from "../../domain/events/events"

export const emailObserver: Observer = (event) => {
  if (event.type === "MemberJoined") {
    console.log(`[Email] Welcome to the gym, ${event.name}!`)
  }
  if (event.type === "MemberSuspended") {
    console.log(`[Email] Your membership has been suspended. Reason: ${event.reason}`)
  }
  if (event.type === "MemberCancelled") {
    console.log(`[Email] Sorry to see you go. Membership ${event.memberId} cancelled.`)
  }
  if (event.type === "PlanLimitReached") {
    console.log(`[Email] You have reached your plan limit. Consider upgrading!`)
  }
}