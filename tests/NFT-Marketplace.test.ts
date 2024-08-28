import { describe, it, expect, beforeEach } from "vitest";
import { Clarinet, Tx, Chain, Account, types } from "clarinet-sdk";

const contractName = "clf-nft-marketplace";

describe(`${contractName} contract tests`, () => {
  let owner: Account;
  let seller: Account;
  let buyer: Account;
  let nftContract: string = "clf-nft"; // Assume NFT contract is deployed and available

  beforeEach(async () => {
    const accounts = Clarinet.getAccounts();
    owner = accounts.get("deployer")!;
    seller = accounts.get("wallet_1")!;
    buyer = accounts.get("wallet_2")!;
  });

  it("should list an NFT for sale", () => {
    let chain = new Chain();

    // Assume seller owns an NFT with token-id 1
    let block = chain.mineBlock([
      Tx.contractCall(
        nftContract,
        "mint",
        [types.principal(seller.address)],
        seller.address
      ),
      Tx.contractCall(
        contractName,
        "list-nft",
        [types.principal(nftContract), types.uint(1), types.uint(1000)],
        seller.address
      ),
    ]);

    block.receipts[1].result.expectOk().expectBool(true);

    let listing = chain.callReadOnlyFn(
      contractName,
      "get-listing",
      [types.principal(nftContract), types.uint(1)],
      seller.address
    );
    listing.result
      .expectSome()
      .expectTuple({ seller: seller.address, price: types.uint(1000) });
  });

  it("should allow a buyer to purchase a listed NFT", () => {
    let chain = new Chain();

    // List NFT for sale
    chain.mineBlock([
      Tx.contractCall(
        nftContract,
        "mint",
        [types.principal(seller.address)],
        seller.address
      ),
      Tx.contractCall(
        contractName,
        "list-nft",
        [types.principal(nftContract), types.uint(1), types.uint(1000)],
        seller.address
      ),
    ]);

    // Buyer purchases NFT
    let buyBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "buy-nft",
        [types.principal(nftContract), types.uint(1)],
        buyer.address
      ),
    ]);

    buyBlock.receipts[0].result.expectOk().expectBool(true);

    // Verify that buyer owns the NFT
    let owner = chain.callReadOnlyFn(
      nftContract,
      "get-owner",
      [types.uint(1)],
      buyer.address
    );
    owner.result.expectSome().expectPrincipal(buyer.address);
  });

  it("should allow the seller to cancel a listing", () => {
    let chain = new Chain();

    // List NFT for sale
    chain.mineBlock([
      Tx.contractCall(
        nftContract,
        "mint",
        [types.principal(seller.address)],
        seller.address
      ),
      Tx.contractCall(
        contractName,
        "list-nft",
        [types.principal(nftContract), types.uint(1), types.uint(1000)],
        seller.address
      ),
    ]);

    // Seller cancels the listing
    let cancelBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "cancel-listing",
        [types.principal(nftContract), types.uint(1)],
        seller.address
      ),
    ]);

    cancelBlock.receipts[0].result.expectOk().expectBool(true);

    // Verify that the listing no longer exists
    let listing = chain.callReadOnlyFn(
      contractName,
      "get-listing",
      [types.principal(nftContract), types.uint(1)],
      seller.address
    );
    listing.result.expectNone();
  });

  it("should not allow a non-owner to cancel a listing", () => {
    let chain = new Chain();

    // List NFT for sale
    chain.mineBlock([
      Tx.contractCall(
        nftContract,
        "mint",
        [types.principal(seller.address)],
        seller.address
      ),
      Tx.contractCall(
        contractName,
        "list-nft",
        [types.principal(nftContract), types.uint(1), types.uint(1000)],
        seller.address
      ),
    ]);

    // Buyer attempts to cancel the listing
    let cancelBlock = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "cancel-listing",
        [types.principal(nftContract), types.uint(1)],
        buyer.address
      ),
    ]);

    cancelBlock.receipts[0].result.expectErr().expectUint(100);
  });
});
