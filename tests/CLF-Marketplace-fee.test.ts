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

  it("should allow the owner to set a new fee percentage", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-fee-percentage",
        [types.uint(10)],
        owner.address
      ), // Set fee to 10%
    ]);

    block.receipts[0].result.expectOk().expectUint(10);

    let feePercentage = chain.callReadOnlyFn(
      contractName,
      "get-fee-percentage",
      [],
      owner.address
    );
    feePercentage.result.expectUint(10);
  });

  it("should not allow a non-owner to set a new fee percentage", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-fee-percentage",
        [types.uint(10)],
        user.address
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(100);
  });
});
