import { describe, it, beforeEach } from "vitest";
import { Clarinet, Tx, Chain, Account, types } from "@clarinet-sdk";

const contractName = "clf-token";

describe(`${contractName} contract tests`, () => {
  let owner: Account;
  let recipient1: Account;
  let recipient2: Account;

  beforeEach(async () => {
    const accounts = Clarinet.getAccounts();
    owner = accounts.get("deployer")!;
    recipient1 = accounts.get("wallet_1")!;
    recipient2 = accounts.get("wallet_2")!;
  });
})