import { describe, it, expect, beforeEach } from "vitest";
import { Clarinet, Tx, Chain, Account, types } from "clarinet-sdk";

const contractName = "clf-marketplace-fee";

describe(`${contractName} contract tests`, () => {
  let owner: Account;
  let user: Account;

  beforeEach(async () => {
    const accounts = Clarinet.getAccounts();
    owner = accounts.get("deployer")!;
    user = accounts.get("wallet_1")!;
  });
});
