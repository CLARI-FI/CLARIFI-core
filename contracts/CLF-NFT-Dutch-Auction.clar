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

;; Buy NFT from Dutch auction
(define-public (buy-from-auction (nft-contract principal) (token-id uint))
  (let
    (
      (auction (map-get? auctions {token-id: token-id, nft-contract: nft-contract}))
    )
    (match auction auction-details
      (let
        (
          (seller (get seller auction-details))
          (start-price (get start-price auction-details))
          (reserve-price (get reserve-price auction-details))
          (duration (get duration auction-details))
          (start-block (get start-block auction-details))
        )
        (let
          (
            (elapsed (block-height - start-block))
            (price 
              (if (> elapsed duration) 
                reserve-price
                (- start-price 
                   (/ (* (- start-price reserve-price) elapsed) duration))))
          )
          (begin
            (asserts! (>= (stx-get-balance tx-sender) price) err-price-not-met)
            (stx-transfer? price tx-sender seller)
            (nft-transfer? nft-contract token-id seller tx-sender)
            (map-delete auctions {token-id: token-id, nft-contract: nft-contract})
            (ok true)
          )
        )
      )
      (err err-not-auctioned)
    )
  )
)

;; Cancel an auction
(define-public (cancel-auction (nft-contract principal) (token-id uint))
  (let
    (
      (auction (map-get? auctions {token-id: token-id, nft-contract: nft-contract}))
    )
    (match auction auction-details
      (let
        (
          (seller (get seller auction-details))
        )
        (begin
          (asserts! (is-eq seller tx-sender) err-not-owner)
          (map-delete auctions {token-id: token-id, nft-contract: nft-contract})
          (ok true)
        )
      )
      (err err-not-auctioned)
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
