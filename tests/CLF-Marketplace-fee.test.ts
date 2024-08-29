import { describe, it, beforeEach } from "vitest";
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

  it("should handle a transaction and collect fees", () => {
    let chain = new Chain();

    // Simulate a transaction with a fee
    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "handle-transaction",
        [types.uint(1000)],
        user.address
      ), // 5% fee should be 50
    ]);

    block.receipts[0].result.expectOk().expectUint(950); // Net amount after fee

    let totalFees = chain.callReadOnlyFn(
      contractName,
      "get-total-fees-collected",
      [],
      owner.address
    );
    totalFees.result.expectUint(50); // 50 STX fee collected
  });

  it("should allow the owner to collect fees", () => {
    let chain = new Chain();

    // Simulate a transaction to collect fees
    chain.mineBlock([
      Tx.contractCall(
        contractName,
        "handle-transaction",
        [types.uint(1000)],
        user.address
      ),
    ]);

    // Collect the fees
    let collectBlock = chain.mineBlock([
      Tx.contractCall(contractName, "collect-fee", [], owner.address),
    ]);

    collectBlock.receipts[0].result.expectOk().expectUint(50); // 50 STX fee collected

    // Check total fees collected is reset to 0
    let totalFees = chain.callReadOnlyFn(
      contractName,
      "get-total-fees-collected",
      [],
      owner.address
    );
    totalFees.result.expectUint(0);
  });
});
