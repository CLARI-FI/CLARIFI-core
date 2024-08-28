import { describe, it, beforeEach } from "vitest";
import { Clarinet, Tx, Chain, Account, types } from "clarinet-sdk";

const contractName = "clf-nft-marketplace";

describe(`${contractName} contract tests`, () => {
  let owner: Account;
  let seller: Account;
  let buyer: Account;
  let nftContract: string = "clf-nft";

  beforeEach(async () => {
    const accounts = Clarinet.getAccounts();
    owner = accounts.get("deployer")!;
    seller = accounts.get("wallet_1")!;
    buyer = accounts.get("wallet_2")!;
  });
});
