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
;; Purchase a listed NFT
;; Cancel a listing

;; read-only functions
;; Get listing details

