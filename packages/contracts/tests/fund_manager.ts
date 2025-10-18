import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FundManager } from "../target/types/fund_manager";
import { describe, it, before } from "mocha";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
  getAccount,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";
import { assert } from "chai";

describe("manage_fund", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FundManager as Program<FundManager>;

  // Keypairs and PDAs that will be used across tests
  const gp = Keypair.generate(); // The fund manager
  let fundPda: PublicKey;
  let fundBump: number;
  let shareMint: Keypair; // The mint for the fund's shares
  let usdcMint: PublicKey; // Shared USDC mint for tests

  // Find the PDA for the fund account before tests run
  before(async () => {
    [fundPda, fundBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("fund"), gp.publicKey.toBuffer()],
      program.programId
    );

    // Airdrop some SOL to the GP for transaction fees
    await provider.connection.requestAirdrop(
      gp.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    // Wait for airdrop confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // The mint for the fund's shares will be a new keypair
    shareMint = Keypair.generate();
  });

  it("Initializes the fund!", async () => {
    const fundName = "My Awesome Fund";
    const fundDescription = "Investing in the future of web3.";
    const fundManager = gp.publicKey;
    const fundWorth = new anchor.BN(1000000);

    // We need to create the mint account before we can initialize the fund
    // Note: In a real app, the mint authority would likely be the fund PDA
    await createMint(
      provider.connection,
      gp, // Payer for mint creation
      gp.publicKey, // Mint authority
      null, // Freeze authority
      9, // Decimals
      shareMint // Keypair for the new mint
    );

    await program.methods
      .initializeFund(fundName, fundDescription, fundManager, fundWorth)
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        mint: shareMint.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([gp]) // GP is the payer and creator
      .rpc();

    // Transfer mint authority from the GP to the fund PDA
    await setAuthority(
      provider.connection,
      gp, // current authority (GP)
      shareMint.publicKey,
      gp, // signing fee payer
      AuthorityType.MintTokens,
      fundPda // New authority
    );

    // Assert: Fetch the account and check if the data was stored correctly
    const fundAccount = await program.account.fundAccount.fetch(fundPda);

    assert.strictEqual(fundAccount.fundName, fundName);
    assert.strictEqual(fundAccount.fundDescription, fundDescription);
    assert.ok(fundAccount.fundManager.equals(fundManager));
    assert.ok(fundAccount.fundWorthInCrypto.eq(fundWorth));
    assert.strictEqual(fundAccount.bump, fundBump);
  });

  it("Mints new shares to a recipient", async () => {
    const recipient = Keypair.generate();
    const amountToMint = new anchor.BN(100);

    // Create an associated token account for the recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp, // Payer
      shareMint.publicKey, // Mint
      recipient.publicKey // Owner
    );

    await program.methods
      .mintShares(amountToMint)
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        mint: shareMint.publicKey,
        recipientTokenAccount: recipientTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([gp])
      .rpc();

    // Assert: Check the recipient's token account balance
    const accountInfo = await getAccount(
      provider.connection,
      recipientTokenAccount.address
    );
    assert.strictEqual(accountInfo.amount.toString(), amountToMint.toString());
  });

  it("Executes an atomic swap", async () => {
    // 1. Setup participants and a mock USDC mint
    const seller = Keypair.generate();
    const buyer = Keypair.generate();
    await provider.connection.requestAirdrop(
      seller.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(buyer.publicKey, LAMPORTS_PER_SOL);
    // Wait for confirmations
    await new Promise(resolve => setTimeout(resolve, 1000));

    usdcMint = await createMint(
      provider.connection,
      gp,
      gp.publicKey,
      null,
      6,
      Keypair.generate()
    );

    // 2. Setup token accounts
    const sellerTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      seller,
      shareMint.publicKey,
      seller.publicKey
    );
    const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer,
      shareMint.publicKey,
      buyer.publicKey
    );
    const sellerUsdcAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      seller,
      usdcMint,
      seller.publicKey
    );
    const buyerUsdcAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer,
      usdcMint,
      buyer.publicKey
    );

    // 3. Fund the accounts for the swap
    const shareAmount = new anchor.BN(50);
    const usdcAmount = new anchor.BN(1000);

    // Mint shares to the seller
    await program.methods
      .mintShares(shareAmount)
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        mint: shareMint.publicKey,
        recipientTokenAccount: sellerTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([gp])
      .rpc();

    // Mint mock USDC to the buyer
    await mintTo(
      provider.connection,
      gp,
      usdcMint,
      buyerUsdcAccount.address,
      gp,
      usdcAmount.toNumber()
    );

    // 4. Execute the swap
    await program.methods
      .executeAtomicSwap(shareAmount, usdcAmount)
      .accounts({
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        buyerTokenAccount: buyerTokenAccount.address,
        sellerTokenAccount: sellerTokenAccount.address,
        buyerUsdcAccount: buyerUsdcAccount.address,
        sellerUsdcAccount: sellerUsdcAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyer, seller])
      .rpc();

    // 5. Assert: Check final balances
    const buyerShareBalance = await provider.connection.getTokenAccountBalance(
      buyerTokenAccount.address
    );
    const sellerUsdcBalance = await provider.connection.getTokenAccountBalance(
      sellerUsdcAccount.address
    );

    assert.strictEqual(buyerShareBalance.value.uiAmount, 50);
    assert.strictEqual(sellerUsdcBalance.value.uiAmount, 1000);
  });

  it("Distributes proceeds to token holders", async () => {
    // 1. Setup a vault and fund it with USDC
    const proceedsUsdcMint = await createMint(
      provider.connection,
      gp,
      gp.publicKey,
      null,
      6,
      Keypair.generate()
    );
    const vaultUsdc = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp,
      proceedsUsdcMint,
      fundPda,
      true
    );
    const totalProceeds = new anchor.BN(10000 * 10 ** 6); // 10,000 USDC
    await mintTo(
      provider.connection,
      gp,
      proceedsUsdcMint,
      vaultUsdc.address,
      gp,
      totalProceeds.toNumber()
    );

    // 2. Setup holders with different share amounts
    const holder1 = Keypair.generate();
    const holder2 = Keypair.generate();
    const holder1TokenAcc = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp,
      shareMint.publicKey,
      holder1.publicKey
    );
    const holder2TokenAcc = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp,
      shareMint.publicKey,
      holder2.publicKey
    );
    const holder1UsdcAcc = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp,
      proceedsUsdcMint,
      holder1.publicKey
    );
    const holder2UsdcAcc = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      gp,
      proceedsUsdcMint,
      holder2.publicKey
    );

    // Mint 75 shares to holder1 and 25 to holder2 (total 100)
    await program.methods
      .mintShares(new anchor.BN(75))
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        mint: shareMint.publicKey,
        recipientTokenAccount: holder1TokenAcc.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([gp])
      .rpc();

    await program.methods
      .mintShares(new anchor.BN(25))
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        mint: shareMint.publicKey,
        recipientTokenAccount: holder2TokenAcc.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([gp])
      .rpc();

    
    const holders = [holder1.publicKey, holder2.publicKey];
    const holderTokenAmounts = [new anchor.BN(75), new anchor.BN(25)];

    // 4. Call the instruction with remainingAccounts
    await program.methods
      .distributeProceeds(totalProceeds, holders, [], holderTokenAmounts) // holderTokenAccounts is unused, pass empty
      .accounts({
        gp: gp.publicKey,
        fund: fundPda,
        vaultUsdc: vaultUsdc.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts([
        // These MUST be in the same order as the loop in your Rust code
        { pubkey: holder1UsdcAcc.address, isWritable: true, isSigner: false },
        { pubkey: holder2UsdcAcc.address, isWritable: true, isSigner: false },
      ])
      .signers([gp])
      .rpc();

    
    const holder1UsdcBalance =
      await provider.connection.getTokenAccountBalance(holder1UsdcAcc.address);
    const holder2UsdcBalance =
      await provider.connection.getTokenAccountBalance(holder2UsdcAcc.address);
    const vaultFinalBalance = await provider.connection.getTokenAccountBalance(
      vaultUsdc.address
    );

    assert.strictEqual(holder1UsdcBalance.value.uiAmount, 7500);
    assert.strictEqual(holder2UsdcBalance.value.uiAmount, 2500);
    assert.strictEqual(vaultFinalBalance.value.uiAmount, 0);
  });
});