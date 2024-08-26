;; title: CLF-NFT-Marketplace
;; version: 1.0.0
;; summary: A marketplace for trading NFTs using STX.
;; description: This contract allows users to list NFTs for sale and purchase them using STX.

;; traits
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; constants
(define-constant err-not-owner (err u100))
(define-constant err-not-listed (err u101))
(define-constant err-price-not-met (err u102))

;; data maps
(define-map listings {token-id: uint, nft-contract: principal} {seller: principal, price: uint})

;; public functions

;; List an NFT for sale
(define-public (list-nft (nft-contract principal) (token-id uint) (price uint))
  (let ((owner (nft-get-owner? nft-contract token-id)))
    (begin
      (asserts! (is-eq owner (some tx-sender)) err-not-owner)
      (map-set listings {token-id: token-id, nft-contract: nft-contract} {seller: tx-sender, price: price})
      (ok true)
    )
  )
)

;; Purchase a listed NFT
(define-public (buy-nft (nft-contract principal) (token-id uint))
  (let
    (
      (listing (map-get? listings {token-id: token-id, nft-contract: nft-contract}))
    )
    (match listing listing-details
      (let
        (
          (seller (get seller listing-details))
          (price (get price listing-details))
        )
        (begin
          (asserts! (>= (stx-get-balance tx-sender) price) err-price-not-met)
          (stx-transfer? price tx-sender seller)
          (nft-transfer? nft-contract token-id seller tx-sender)
          (map-delete listings {token-id: token-id, nft-contract: nft-contract})
          (ok true)
        )
      )
      (err err-not-listed)
    )
  )
)

;; Cancel a listing
(define-public (cancel-listing (nft-contract principal) (token-id uint))
  (let
    (
      (listing (map-get? listings {token-id: token-id, nft-contract: nft-contract}))
    )
    (match listing listing-details
      (let
        (
          (seller (get seller listing-details))
        )
        (begin
          (asserts! (is-eq seller tx-sender) err-not-owner)
          (map-delete listings {token-id: token-id, nft-contract: nft-contract})
          (ok true)
        )
      )
      (err err-not-listed)
    )
  )
)

;; read-only functions

;; Get listing details
(define-read-only (get-listing (nft-contract principal) (token-id uint))
  (match (map-get? listings {token-id: token-id, nft-contract: nft-contract})
    listing (ok listing)
    (ok none)
  )
)
