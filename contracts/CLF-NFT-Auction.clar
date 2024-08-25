;; title: CLF-NFT-Dutch-Auction
;; version: 1.0.0
;; summary: A Dutch auction contract for NFTs using STX.
;; description: This contract enables users to auction their NFTs with a price that decreases over time until sold.

;; traits
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; constants
(define-constant err-not-owner (err u100))
(define-constant err-not-auctioned (err u101))
(define-constant err-price-not-met (err u102))
(define-constant err-auction-ended (err u103))

;; data maps
(define-map auctions {token-id: uint, nft-contract: principal} 
  {seller: principal, start-price: uint, reserve-price: uint, duration: uint, start-block: uint})

;; public functions

;; Start a Dutch auction
(define-public (start-auction (nft-contract principal) (token-id uint) 
                              (start-price uint) (reserve-price uint) (duration uint))
  (let ((owner (nft-get-owner? nft-contract token-id)))
    (begin
      (asserts! (is-eq owner (some tx-sender)) err-not-owner)
      (map-set auctions {token-id: token-id, nft-contract: nft-contract} 
        {seller: tx-sender, start-price: start-price, reserve-price: reserve-price, 
         duration: duration, start-block: (block-height)})
      (ok true)
    )
  )
)

;; read-only functions

;; Get auction details
(define-read-only (get-auction (nft-contract principal) (token-id uint))
  (match (map-get? auctions {token-id: token-id, nft-contract: nft-contract})
    auction (ok auction)
    (ok none)
  )
)
