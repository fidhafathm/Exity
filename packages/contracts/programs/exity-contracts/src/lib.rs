use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Token, Transfer, MintTo};

declare_id!("GSjA2AvdPKxLRHKbeVy4czLMTegKqaeHc1DzEJo5QvNz");

#[program]
pub mod manage_fund{
    use super::*;

    //initialize the fund
    pub fn initialize_fund(
        ctx: Context<InitializeFund>, 
        fund_name: String, 
        fund_description: String, 
        fund_manager: Pubkey,
        fund_worth_in_crypto: u64
    ) -> Result<()> {

        let fund = &mut ctx.accounts.fund;
        fund.fund_name = fund_name;
        fund.fund_description = fund_description;
        fund.fund_manager = fund_manager;
        fund.fund_worth_in_crypto = fund_worth_in_crypto;
        Ok(())
    }

    pub fn mint_shares(
        ctx: Context<MintShares>,
        amount: u64,
    ) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.fund.to_account_info(),
        };
        let seeds = &[b"fund".as_ref(), ctx.accounts.gp.key.as_ref(), &[ctx.accounts.fund.bump]];
        let signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn execute_atomic_swap(
        ctx: Context<ExecuteAtomicSwap>,
        token_amount: u64,
        usdc_amount: u64,
    ) -> Result<()> {
        // transfer LP tokens from seller to buyer
        let cpi_accounts_t = Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_ctx_t = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_t);
        token::transfer(cpi_ctx_t, token_amount)?;

        // transfer USDC from buyer to seller
        let cpi_accounts_u = Transfer {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.seller_usdc_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_ctx_u = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_u);
        token::transfer(cpi_ctx_u, usdc_amount)?;

        Ok(())
    }

    pub fn distribute_proceeds(
        ctx: Context<DistributeProceeds>,
        total_amount: u64,
        holders: Vec<Pubkey>,
        holder_token_accounts: Vec<Pubkey>,
        holder_token_amounts: Vec<u64>,
    ) -> Result<()> {
        // basic check lengths
        require!(holders.len() == holder_token_accounts.len() && holders.len() == holder_token_amounts.len(), CustomError::InvalidSnapshot);

        // total tokens sum
        let mut total_tokens: u128 = 0;
        for amt in holder_token_amounts.iter() {
            total_tokens = total_tokens.checked_add(*amt as u128).ok_or(CustomError::MathOverflow)?;
        }
        require!(total_tokens > 0, CustomError::MathOverflow);

        // For each holder, calculate share and transfer USDC from fund_vault to holder_usdc_account (passed in accounts)
        for i in 0..holders.len() {
            let share = (holder_token_amounts[i] as u128)
                .checked_mul(total_amount as u128)
                .ok_or(CustomError::MathOverflow)?
                / total_tokens;
            let share_u64 = share as u64;

            let accounts_iter = &mut ctx.remaining_accounts.iter();
            // Expect the next account to be the recipient's USDC token account
            let recipient_usdc_acc = accounts_iter.next().ok_or(CustomError::MissingAccount)?.to_account_info();
            // transfer from vault to recipient
            let cpi_accounts = Transfer {
                from: ctx.accounts.vault_usdc.to_account_info(),
                to: recipient_usdc_acc.clone(),
                authority: ctx.accounts.fund.to_account_info(),
            };
            let seeds = &[b"fund".as_ref(), ctx.accounts.gp.key.as_ref(), &[ctx.accounts.fund.bump]];
            let signer = &[&seeds[..]];
            let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
            token::transfer(cpi_ctx, share_u64)?;
        }

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, decimals: u8)]
pub struct InitializeFund<'info> {
    #[account(mut)]
    pub gp: Signer<'info>,
    /// CHECK: fund PDA account
    #[account(init, payer = gp, space = 8 + 32 + 64 + 16 + 1 + 1, seeds = [b"fund", gp.key().as_ref()], bump)]
    pub fund: Account<'info, FundAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintShares<'info> {
    #[account(mut)]
    pub gp: Signer<'info>,
    /// CHECK: fund PDA
    #[account(mut, seeds = [b"fund", gp.key().as_ref()], bump = fund.bump)]
    pub fund: Account<'info, FundAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ExecuteAtomicSwap<'info> {
    /// CHECK: buyer signer
    pub buyer: Signer<'info>,
    /// CHECK: seller signer (must be provided as signer)
    pub seller: Signer<'info>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_usdc_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeProceeds<'info> {
    #[account(mut)]
    pub gp: Signer<'info>,
    /// CHECK: fund PDA
    #[account(mut, seeds = [b"fund", gp.key().as_ref()], bump = fund.bump)]
    pub fund: Account<'info, FundAccount>,
    /// CHECK: vault USDC account owned by fund PDA
    #[account(mut)]
    pub vault_usdc: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct FundAccount {
    pub fund_name: String,
    pub fund_description: String,
    pub fund_manager: Pubkey,
    pub fund_worth_in_crypto: u64,
    pub bump: u8,
}

#[error_code]
pub enum CustomError {
    #[msg("Invalid snapshot data")]
    InvalidSnapshot,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Missing expected account")]
    MissingAccount,
}