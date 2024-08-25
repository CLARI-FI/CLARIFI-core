;; title: CLF-NFT
;; version: 1
;; summary: CLARIFI (CLF) NFT Contract
;; description: Core NFT contract for the CLARIFI protocol

;; traits
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; token definitions
(define-non-fungible-token CLF-NFT uint)

;; constants
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-clf-token-not-set (err u103)) ;; Removed custom error message

;; data vars
(define-data-var owner principal tx-sender)
(define-data-var last-token-id uint u0)
(define-data-var clf-token-address (optional principal) none) ;; Variable to store the clf-token contract address

;; data maps
(define-map minters principal bool)
(define-map token-uri-map uint (optional (buff 256)))
(define-map token-metadata uint (optional (buff 1024)))

;; public functions

;; Function to set the clf-token contract address
(define-public (set-clf-token-address (token-address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-owner-only)
    (var-set clf-token-address (some token-address))
    (ok token-address)
  )
)

;; Function to transfer ownership
(define-public (set-owner (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-owner-only)
    (var-set owner new-owner)
    (ok new-owner)
  )
)

;; Function to add minters
(define-public (add-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-owner-only)
    (map-set minters minter true)
    (ok minter)
  )
)

;; Minting function
(define-public (mint (recipient principal))
  (let
      (
          (token-id (+ (var-get last-token-id) u1))
      )
      (asserts! (is-eq (default-to false (map-get? minters tx-sender)) true) err-owner-only)
      (try! (nft-mint? CLF-NFT token-id recipient))
      (var-set last-token-id token-id)
      (ok token-id)
  )
)

;; Transfer function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (nft-transfer? CLF-NFT token-id sender recipient)
  )
)

;; Function to transfer with royalty
(define-constant royalty-fee u5) ;; 5% royalty
(define-public (transfer-with-royalty (token-id uint) (sender principal) (recipient principal))
  (let ((token-address (var-get clf-token-address)))
    (asserts! (is-some token-address) err-clf-token-not-set)
    (let ((royalty-amount (/ (* royalty-fee (ft-get-balance (unwrap-panic token-address) sender)) u100)))
      (asserts! (>= (ft-get-balance (unwrap-panic token-address) sender) royalty-amount) err-insufficient-balance)
      (ft-transfer? (unwrap-panic token-address) royalty-amount sender (var-get owner)) ;; Transfer royalty to the original owner
      (nft-transfer? CLF-NFT token-id sender recipient)
    )
  )
)

;; Function to burn a token
(define-public (burn (token-id uint))
  (begin
    (asserts! (is-eq tx-sender (nft-get-owner? CLF-NFT token-id)) err-not-token-owner)
    (nft-burn? CLF-NFT token-id tx-sender)
    (ok true)
  )
)

;; Function to set token URI
(define-public (set-token-uri (token-id uint) (uri (buff 256)))
  (begin
    (asserts! (is-eq tx-sender (nft-get-owner? CLF-NFT token-id)) err-not-token-owner)
    (map-set token-uri-map token-id (some uri))
    (ok uri)
  )
)

;; Function to set token metadata
(define-public (set-token-metadata (token-id uint) (metadata (buff 1024)))
  (begin
    (asserts! (is-eq tx-sender (nft-get-owner? CLF-NFT token-id)) err-not-token-owner)
    (map-set token-metadata token-id (some metadata))
    (ok metadata)
  )
)

;; read-only functions

;; Get the last minted token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; Get token URI
(define-read-only (get-token-uri (token-id uint))
  (match (map-get? token-uri-map token-id)
    uri (ok uri)
    (ok none)
  )
)

;; Get token metadata
(define-read-only (get-token-metadata (token-id uint))
  (match (map-get? token-metadata token-id)
    metadata (ok metadata)
    (ok none)
  )
)

;; Get the owner of a token
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? CLF-NFT token-id))
)

;; Get the contract owner
(define-read-only (get-contract-owner)
  (ok (var-get owner))
)
