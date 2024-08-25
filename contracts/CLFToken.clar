;; title: CLFToken
;; version: 1
;; summary: CLARIFI(CLF) Token Contract
;; description: Core Token contract for CLARIFI protocol

;; traits
(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
(define-fungible-token clf-token)

;; constants
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-exceeds-max-supply (err u102))

;; data variables
(define-data-var owner principal tx-sender)
(define-constant max-supply u1000000) ;; Example maximum supply

;; public functions

;; Function to transfer ownership
(define-public (set-owner (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-owner-only)
    (var-set owner new-owner)
    (ok new-owner)
  )
)

;; Minting function
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-owner-only)
    (let ((current-supply (ft-get-supply clf-token)))
      (asserts! (<= (+ current-supply amount) max-supply) err-exceeds-max-supply)
      (ft-mint? clf-token amount recipient)
    )
  )
)

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? clf-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; read only functions

(define-read-only (get-name)
  (ok "clarifi-token")
)

(define-read-only (get-symbol)
  (ok "CLF")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clf-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply clf-token))
)

(define-read-only (get-token-uri)
  (ok none)
)

(define-read-only (get-owner)
  (ok (var-get owner))
)

;; private functions
;;
