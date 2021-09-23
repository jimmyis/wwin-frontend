import { ContractSendMethod as ContractMethod } from '@/libs/web3'

export interface ContractMethods {
  allowance(owner: string, spender: string): ContractMethod
  approve(spender: string, amount: string): ContractMethod
  balanceOf(account: string): ContractMethod
  burn(amount: string): ContractMethod
  decimals(): ContractMethod
  decreaseAllowance(spender: string, subtractedValue: string): ContractMethod
  getOwner(): ContractMethod
  increaseAllowance(spender: string, addedValue: string): ContractMethod
  mint(amonunt: string): ContractMethod
  name(): ContractMethod
  owner(): ContractMethod
  renounceOwnership(): ContractMethod
  symbol(): ContractMethod
  totalSupply(): ContractMethod
  transfer(recipient: string, amount: string): ContractMethod
  transferFrom(sender: string, recipient: string, amount: string): ContractMethod
  transferOwnership(newOwner: string): ContractMethod
}

export interface ContractEvents {
  Approval(owner: string, spender: string, value: string): ContractMethod
  OwnershipTransferred(previousOwner: string, newOwner: string): ContractMethod
  Transfer(from: string, to: string, value: string): ContractMethod
}
