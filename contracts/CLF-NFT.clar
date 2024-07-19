
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
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        ;; #[filter(token-id, recipient)]
        (nft-transfer? CLF-NFT token-id sender recipient)
    )
)

;; read only functions
;;
(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none)
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? CLF-NFT token-id))
)

;; private functions
;;

