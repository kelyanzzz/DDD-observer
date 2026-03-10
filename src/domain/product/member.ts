import { MemberId, MemberName, Email, MonthlyFee, CheckInsCount, PlanLimit } from "./types"
import { GymEvent, Observer } from "../events/events"

export type Member = {
  id: MemberId
  name: MemberName
  email: Email
  monthlyFee: MonthlyFee
  status: "Active" | "Suspended" | "Cancelled"
  checkIns: CheckInsCount
  planLimit: PlanLimit
  observers: Observer[]
}