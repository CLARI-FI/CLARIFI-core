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

  it("should not allow unauthorized minting", () => {
    let chain = new Chain();

    let block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "mint",
        [types.principal(recipient1.address)],
        recipient1.address
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(100);
  });

  it("should transfer NFT", () => {
    let chain = new Chain();

    chain.mineBlock([
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

    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "transfer",
        [
          types.uint(1),
          types.principal(minter.address),
          types.principal(recipient1.address),
        ],
        minter.address
      ),
    ]);

    transferBlock.receipts[0].result.expectOk().expectBool(true);

    let tokenOwner = chain.callReadOnlyFn(
      contractName,
      "get-owner",
      [types.uint(1)],
      recipient1.address
    );
    tokenOwner.result.expectSome().expectPrincipal(recipient1.address);
  });


  it("should burn an NFT", () => {
    let chain = new Chain();

    chain.mineBlock([
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

    let burnBlock = chain.mineBlock([
      Tx.contractCall(contractName, "burn", [types.uint(1)], minter.address),
    ]);

    burnBlock.receipts[0].result.expectOk().expectBool(true);

    let tokenOwner = chain.callReadOnlyFn(
      contractName,
      "get-owner",
      [types.uint(1)],
      minter.address
    );
    tokenOwner.result.expectNone();
  });

  it("should set and get token URI", () => {
    let chain = new Chain();

    chain.mineBlock([
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

    let uriBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-token-uri",
        [types.uint(1), types.buff(Buffer.from("https://example.com/nft/1"))],
        minter.address
      ),
    ]);

    uriBlock.receipts[0].result
      .expectOk()
      .expectBuff(Buffer.from("https://example.com/nft/1"));

    let tokenUri = chain.callReadOnlyFn(
      contractName,
      "get-token-uri",
      [types.uint(1)],
      minter.address
    );
    tokenUri.result
      .expectSome()
      .expectBuff(Buffer.from("https://example.com/nft/1"));
  });

  it("should set and get token metadata", () => {
    let chain = new Chain();

    chain.mineBlock([
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

    let metadataBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "set-token-metadata",
        [types.uint(1), types.buff(Buffer.from("metadata"))],
        minter.address
      ),
    ]);

    metadataBlock.receipts[0].result
      .expectOk()
      .expectBuff(Buffer.from("metadata"));

    let tokenMetadata = chain.callReadOnlyFn(
      contractName,
      "get-token-metadata",
      [types.uint(1)],
      minter.address
    );
    tokenMetadata.result.expectSome().expectBuff(Buffer.from("metadata"));
  });

  it("should handle batch minting", () => {
    let chain = new Chain();

    chain.mineBlock([
      Tx.contractCall(
        contractName,
        "add-minter",
        [types.principal(minter.address)],
        owner.address
      ),
    ]);

    let recipients = [minter.address, recipient1.address, recipient2.address];
    let batchMintBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "batch-mint",
        [types.list(recipients.map((recipient) => types.principal(recipient)))],
        minter.address
      ),
    ]);

    batchMintBlock.receipts[0].result.expectOk().expectBool(true);

    recipients.forEach((recipient, index) => {
      let tokenOwner = chain.callReadOnlyFn(
        contractName,
        "get-owner",
        [types.uint(index + 1)],
        minter.address
      );
      tokenOwner.result.expectSome().expectPrincipal(recipient);
    });
  });

})