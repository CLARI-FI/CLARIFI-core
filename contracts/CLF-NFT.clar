
;; title: CLF-NFT
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; token definitions
;;
(define-non-fungible-token CLF-NFT uint)

;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; data vars
;;
(define-data-var last-token-id uint u0)

;; data maps
;;

;; public functions
;;

;; read only functions
;;

;; private functions
;;

