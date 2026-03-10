import { MemberId, MemberName } from "../product/types"

export type GymEvent =
  | { type: "MemberJoined"; memberId: MemberId; name: MemberName }
  | { type: "MemberCheckedIn"; memberId: MemberId; totalCheckIns: number }
  | { type: "MemberSuspended"; memberId: MemberId; reason: string }
  | { type: "MemberCancelled"; memberId: MemberId }
  | { type: "PlanLimitReached"; memberId: MemberId; checkIns: number }

export type Observer = (event: GymEvent) => void