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

  it("should transfer tokens between accounts", () => {
    let chain = new Chain();

    chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(1000), types.principal(recipient1.address)],
        owner.address
      ),
    ]);

    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "transfer",
        [
          types.uint(500),
          types.principal(recipient1.address),
          types.principal(recipient2.address),
          types.none(),
        ],
        recipient1.address
      ),
    ]);

    transferBlock.receipts[0].result.expectOk().expectBool(true);

    let balance1 = chain.callReadOnlyFn(
      contractName,
      "get-balance",
      [types.principal(recipient1.address)],
      recipient1.address
    );
    balance1.result.expectUint(500);

    let balance2 = chain.callReadOnlyFn(
      contractName,
      "get-balance",
      [types.principal(recipient2.address)],
      recipient2.address
    );
    balance2.result.expectUint(500);
  });

  it("should not allow transfer from non-owner", () => {
    let chain = new Chain();

    chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(1000), types.principal(recipient1.address)],
        owner.address
      ),
    ]);

    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "transfer",
        [
          types.uint(500),
          types.principal(recipient2.address),
          types.principal(recipient1.address),
          types.none(),
        ],
        recipient2.address
      ),
    ]);

    transferBlock.receipts[0].result.expectErr().expectUint(101);
  });

  it("should respect the maximum supply", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(900000), types.principal(recipient1.address)],
        owner.address
      ),
      Tx.contractCall(
        contractName,
        "mint",
        [types.uint(200000), types.principal(recipient2.address)],
        owner.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectErr().expectUint(102);
  });

  it("should transfer ownership", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-owner",
        [types.principal(recipient1.address)],
        owner.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectPrincipal(recipient1.address);

    let newOwner = chain.callReadOnlyFn(
      contractName,
      "get-owner",
      [],
      recipient1.address
    );
    newOwner.result.expectPrincipal(recipient1.address);
  });

  it("should not allow non-owner to transfer ownership", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-owner",
        [types.principal(recipient2.address)],
        recipient1.address
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(100);
  });

  it("should return token details correctly", () => {
    let chain = new Chain();

    let name = chain.callReadOnlyFn(
      contractName,
      "get-name",
      [],
      owner.address
    );
    name.result.expectOk().expectAscii("clarifi-token");

    let symbol = chain.callReadOnlyFn(
      contractName,
      "get-symbol",
      [],
      owner.address
    );
    symbol.result.expectOk().expectAscii("CLF");

    let decimals = chain.callReadOnlyFn(
      contractName,
      "get-decimals",
      [],
      owner.address
    );
    decimals.result.expectOk().expectUint(6);

    let totalSupply = chain.callReadOnlyFn(
      contractName,
      "get-total-supply",
      [],
      owner.address
    );
    totalSupply.result.expectOk().expectUint(0);
  });
});