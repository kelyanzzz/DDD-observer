export type MemberId = string & { readonly __brand: unique symbol }
export type MemberName = string & { readonly __brand: unique symbol }
export type Email = string & { readonly __brand: unique symbol }
export type MonthlyFee = number & { readonly __brand: unique symbol }
export type CheckInsCount = number & { readonly __brand: unique symbol }
export type PlanLimit = number & { readonly __brand: unique symbol }