;; title: CLF-Marketplace-Fee
;; version: 1.0.0
;; summary: A contract for managing marketplace fees.
;; description: This contract collects and distributes fees from marketplace transactions.

;; constants
(define-constant fee-percentage u5) ;; 5% fee by default
(define-constant err-not-owner (err u100))

;; data variables
(define-data-var owner principal tx-sender)
(define-data-var fees-collected uint u0)

;; public functions

;; Set a new fee percentage
(define-public (set-fee-percentage (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-not-owner)
    (var-set fee-percentage new-fee)
    (ok new-fee)
  )
)

;; Collect fees accumulated in the contract
(define-public (collect-fee)
  (let
    (
      (fees (var-get fees-collected))
    )
    (begin
      (asserts! (is-eq tx-sender (var-get owner)) err-not-owner)
      (stx-transfer? fees tx-sender (var-get owner))
      (var-set fees-collected u0)
      (ok fees)
    )
  )
)

;; Handle fee deduction during transactions
(define-public (handle-transaction (amount uint))
  (let
    (
      (fee (/ (* amount (var-get fee-percentage)) u100))
      (net-amount (- amount fee))
    )
    (begin
      (var-set fees-collected (+ (var-get fees-collected) fee))
      (ok net-amount)
    )
  )
)

;; read-only functions

;; Get current fee percentage
(define-read-only (get-fee-percentage)
  (ok (var-get fee-percentage))
)

;; Get total fees collected
(define-read-only (get-total-fees-collected)
  (ok (var-get fees-collected))
)
