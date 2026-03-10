import { createMember, checkIn, suspendMember, cancelMembership, subscribe } from "./src/domain/product/factories"
import { emailObserver } from "./src/infrastructure/observers/emails"
import { databaseObserver, trainerObserver, loggerObserver } from "./src/infrastructure/observers/database"
// Gym Membership Domain - Kelyan
// -- Test 1: Create valid member --
console.log("\n-- Test 1: Create valid member --")
let member = createMember("Kelyan", "kelyan@gym.com", 49.99, 10)
member = subscribe(member, loggerObserver)
member = subscribe(member, emailObserver)
member = subscribe(member, trainerObserver)
member = subscribe(member, databaseObserver)
console.log(`Created: ${member.name} | Status: ${member.status}`)

// -- Test 2: Member checks in --
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