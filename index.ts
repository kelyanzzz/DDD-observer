import { v4 as uuidv4 } from "uuid"

// =============================== //
//         TYPE DEFINITIONS       //
// ============================== //

type MemberId = string & { readonly __brand: unique symbol }
type MemberName = string & { readonly __brand: unique symbol }
type Email = string & { readonly __brand: unique symbol }
type MonthlyFee = number & { readonly __brand: unique symbol }
type CheckInsCount = number & { readonly __brand: unique symbol }
type PlanLimit = number & { readonly __brand: unique symbol }

// =============================== //
//         EVENT TYPES            //
// ============================== //

type GymEvent =
  | { type: "MemberJoined"; memberId: MemberId; name: MemberName }
  | { type: "MemberCheckedIn"; memberId: MemberId; totalCheckIns: CheckInsCount }
  | { type: "MemberSuspended"; memberId: MemberId; reason: string }
  | { type: "MemberCancelled"; memberId: MemberId }
  | { type: "PlanLimitReached"; memberId: MemberId; checkIns: CheckInsCount }

type Observer = (event: GymEvent) => void

// =============================== //
//        ENTITY DEFINITION       //
// ============================== //

type Member = {
  id: MemberId
  name: MemberName
  email: Email
  monthlyFee: MonthlyFee
  status: "Active" | "Suspended" | "Cancelled"
  checkIns: CheckInsCount
  planLimit: PlanLimit
  observers: Observer[]
}

// =============================== //
//        FACTORY FUNCTIONS       //
// ============================== //

function createMemberName(value: string): MemberName {
  if (!value || value.trim().length === 0) {
    throw new Error("Member name cannot be empty")
  }
  if (value.trim().length < 2) {
    throw new Error("Member name must be at least 2 characters")
  }
  return value as MemberName
}

function createEmail(value: string): Email {
  if (!value.includes("@")) {
    throw new Error("Invalid email address")
  }
  return value as Email
}

function createMonthlyFee(value: number): MonthlyFee {
  if (value <= 0) {
    throw new Error("Monthly fee must be greater than zero")
  }
  if (!isFinite(value)) {
    throw new Error("Monthly fee must be a valid number")
  }
  return value as MonthlyFee
}

function createCheckInsCount(value: number): CheckInsCount {
  if (!Number.isInteger(value)) throw new Error("Check-ins must be a whole number")
  if (value < 0) throw new Error("Check-ins cannot be negative")
  return value as CheckInsCount
}

function createPlanLimit(value: number): PlanLimit {
  if (!Number.isInteger(value)) throw new Error("Plan limit must be a whole number")
  if (value <= 0) throw new Error("Plan limit must be at least 1")
  return value as PlanLimit
}

function createMember(
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

  notify(member, {
    type: "MemberJoined",
    memberId: member.id,
    name: member.name,
  })

  return member
}

// =============================== //
//        OBSERVER SETUP          //
// ============================== //

function notify(member: Member, event: GymEvent): void {
  member.observers.forEach((obs) => obs(event))
}

function subscribe(member: Member, observer: Observer): Member {
  return {
    ...member,
    observers: [...member.observers, observer],
  }
}

function unsubscribe(member: Member, observer: Observer): Member {
  return {
    ...member,
    observers: member.observers.filter((obs) => obs !== observer),
  }
}

// =============================== //
//        DOMAIN OPERATIONS       //
// ============================== //

function checkIn(member: Member): Member {
  if (member.status !== "Active") {
    throw new Error(
      `Member "${member.name}" cannot check in — status is ${member.status}`
    )
  }

  const newCheckIns = createCheckInsCount(member.checkIns + 1)
  const updated: Member = { ...member, checkIns: newCheckIns }

  notify(updated, {
    type: "MemberCheckedIn",
    memberId: updated.id,
    totalCheckIns: updated.checkIns,
  })

  if (newCheckIns >= updated.planLimit) {
    notify(updated, {
      type: "PlanLimitReached",
      memberId: updated.id,
      checkIns: newCheckIns,
    })
  }

  return updated
}

function suspendMember(member: Member, reason: string): Member {
  if (member.status !== "Active") {
    throw new Error("Only active members can be suspended")
  }

  const updated: Member = { ...member, status: "Suspended" }

  notify(updated, {
    type: "MemberSuspended",
    memberId: updated.id,
    reason,
  })

  return updated
}

function cancelMembership(member: Member): Member {
  if (member.status === "Cancelled") {
    throw new Error("Membership is already cancelled")
  }

  const updated: Member = { ...member, status: "Cancelled" }

  notify(updated, {
    type: "MemberCancelled",
    memberId: updated.id,
  })

  return updated
}

// =============================== //
//           OBSERVERS            //
// ============================== //

const loggerObserver: Observer = (event) => {
  console.log(`[Logger] Event occurred: ${event.type}`)
}

const emailObserver: Observer = (event) => {
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

const trainerObserver: Observer = (event) => {
  if (event.type === "MemberCheckedIn") {
    console.log(`[Trainer] Member checked in — total visits: ${event.totalCheckIns}`)
  }
}

const databaseObserver: Observer = (event) => {
  console.log(`[DB] Saving to audit log: ${event.type}`)
}

// =============================== //
//           TEST RUNS            //
// ============================== //

// -- Test 1: Valid member creation --
console.log("\n-- Test 1: Create valid member --")
let member = createMember("Kelyan Ihinack", "kyky@gym.com", 49.99, 10)
member = subscribe(member, loggerObserver)
member = subscribe(member, emailObserver)
member = subscribe(member, trainerObserver)
member = subscribe(member, databaseObserver)
console.log(`Created: ${member.name} | Status: ${member.status}`)

// -- Test 2: Check in --
console.log("\n-- Test 2: Member checks in --")
member = checkIn(member)
member = checkIn(member)
console.log(`Check-ins: ${member.checkIns}`)

// -- Test 3: Reach plan limit --
console.log("\n-- Test 3: Reach plan limit --")
let limitMember = createMember("Jane Smith", "jane@gym.com", 29.99, 2)
limitMember = subscribe(limitMember, loggerObserver)
limitMember = subscribe(limitMember, emailObserver)
limitMember = subscribe(limitMember, trainerObserver)
limitMember = checkIn(limitMember)
limitMember = checkIn(limitMember)

// -- Test 4: Suspend member --
console.log("\n-- Test 4: Suspend member --")
member = suspendMember(member, "Unpaid fees")
console.log(`Status: ${member.status}`)

// -- Test 5: Check in while suspended --
console.log("\n-- Test 5: Check in while suspended --")
try {
  member = checkIn(member)
} catch (error) {
  console.error("Caught:", error instanceof Error ? error.message : error)
}

// -- Test 6: Cancel membership --
console.log("\n-- Test 6: Cancel membership --")
member = cancelMembership(member)
console.log(`Status: ${member.status}`)

// -- Test 7: Cancel already cancelled --
console.log("\n-- Test 7: Cancel already cancelled --")
try {
  member = cancelMembership(member)
} catch (error) {
  console.error("Caught:", error instanceof Error ? error.message : error)
}

// -- Test 8: Invalid email --
console.log("\n-- Test 8: Invalid email --")
try {
  createMember("Bad Guy", "notanemail", 49.99, 10)
} catch (error) {
  console.error("Caught:", error instanceof Error ? error.message : error)
}

// -- Test 9: Negative fee --
console.log("\n-- Test 9: Negative monthly fee --")
try {
  createMember("Cheap Guy", "cheap@gym.com", -30, 10)
} catch (error) {
  console.error("Caught:", error instanceof Error ? error.message : error)
}

// -- Test 10: Empty name --
console.log("\n-- Test 10: Empty member name --")
try {
  createMember("", "empty@gym.com", 49.99, 10)
} catch (error) {
  console.error("Caught:", error instanceof Error ? error.message : error)
}