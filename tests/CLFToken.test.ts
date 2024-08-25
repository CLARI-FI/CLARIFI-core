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

  it("should mint tokens by the owner", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(1000), types.principal(recipient1.address)],
        owner.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

    let balance = chain.callReadOnlyFn(
      contractName,
      "get-balance",
      [types.principal(recipient1.address)],
      recipient1.address
    );
    balance.result.expectUint(1000);
  });

  it("should not allow unauthorized minting", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(1000), types.principal(recipient1.address)],
        recipient1.address
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(100);
  });
})