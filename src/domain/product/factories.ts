import { v4 as uuidv4 } from "uuid"
import { MemberId, MemberName, Email, MonthlyFee, CheckInsCount, PlanLimit } from "./types"
import { Member } from "./member"
import { GymEvent, Observer } from "../events/events"

export function createMemberName(value: string): MemberName {
  if (!value || value.trim().length === 0) throw new Error("Member name cannot be empty")
  if (value.trim().length < 2) throw new Error("Member name must be at least 2 characters")
  return value as MemberName
}

export function createEmail(value: string): Email {
  if (!value.includes("@")) throw new Error("Invalid email address")
  return value as Email
}

export function createMonthlyFee(value: number): MonthlyFee {
  if (value <= 0) throw new Error("Monthly fee must be greater than zero")
  if (!isFinite(value)) throw new Error("Monthly fee must be a valid number")
  return value as MonthlyFee
}

export function createCheckInsCount(value: number): CheckInsCount {
  if (!Number.isInteger(value)) throw new Error("Check-ins must be a whole number")
  if (value < 0) throw new Error("Check-ins cannot be negative")
  return value as CheckInsCount
}

export function createPlanLimit(value: number): PlanLimit {
  if (!Number.isInteger(value)) throw new Error("Plan limit must be a whole number")
  if (value <= 0) throw new Error("Plan limit must be at least 1")
  return value as PlanLimit
}

export function notify(member: Member, event: GymEvent): void {
  member.observers.forEach((obs) => obs(event))
}

export function subscribe(member: Member, observer: Observer): Member {
  return { ...member, observers: [...member.observers, observer] }
}

export function unsubscribe(member: Member, observer: Observer): Member {
  return { ...member, observers: member.observers.filter((obs) => obs !== observer) }
}

export function createMember(
  name: string,
  email: string,
  monthlyFee: number,
  planLimit: number,
): Member {
  const member: Member = {
    id: uuidv4() as MemberId,
    name: createMemberName(name),
    email: createEmail(email),
    monthlyFee: createMonthlyFee(monthlyFee),
    status: "Active",
    checkIns: createCheckInsCount(0),
    planLimit: createPlanLimit(planLimit),
    observers: [],
  }
  notify(member, { type: "MemberJoined", memberId: member.id, name: member.name })
  return member
}

export function checkIn(member: Member): Member {
  if (member.status !== "Active") {
    throw new Error(`Member "${member.name}" cannot check in — status is ${member.status}`)
  }
  const newCheckIns = createCheckInsCount(member.checkIns + 1)
  const updated: Member = { ...member, checkIns: newCheckIns }
  notify(updated, { type: "MemberCheckedIn", memberId: updated.id, totalCheckIns: updated.checkIns })
  if (newCheckIns >= updated.planLimit) {
    notify(updated, { type: "PlanLimitReached", memberId: updated.id, checkIns: newCheckIns })
  }
  return updated
}

export function suspendMember(member: Member, reason: string): Member {
  if (member.status !== "Active") throw new Error("Only active members can be suspended")
  const updated: Member = { ...member, status: "Suspended" }
  notify(updated, { type: "MemberSuspended", memberId: updated.id, reason })
  return updated
}

export function cancelMembership(member: Member): Member {
  if (member.status === "Cancelled") throw new Error("Membership is already cancelled")
  const updated: Member = { ...member, status: "Cancelled" }
  notify(updated, { type: "MemberCancelled", memberId: updated.id })
  return updated
}