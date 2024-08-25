import { describe, it, expect, beforeEach } from "vitest";
import { Clarinet, Tx, Chain, Account, types } from "clarinet-sdk";

const contractName = "clf-nft";

describe(`${contractName} contract tests`, () => {
  let owner: Account;
  let minter: Account;
  let recipient1: Account;
  let recipient2: Account;

  beforeEach(async () => {
    const accounts = Clarinet.getAccounts();
    owner = accounts.get("deployer")!;
    minter = accounts.get("wallet_1")!;
    recipient1 = accounts.get("wallet_2")!;
    recipient2 = accounts.get("wallet_3")!;
  });

  it("should mint an NFT by the owner", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "add-minter",
        [types.principal(minter.address)],
        owner.address
      ),
      Tx.contractCall(
        contractName,
        "mint",
        [types.principal(minter.address)],
        minter.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUint(1);

    let tokenOwner = chain.callReadOnlyFn(
      contractName,
      "get-owner",
      [types.uint(1)],
      minter.address
    );
    tokenOwner.result.expectSome().expectPrincipal(minter.address);
  });
})