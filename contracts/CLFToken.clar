
;; title: CLFToken
;; version: 1
;; summary: CLARIFI(CLF) Token Contract
;; description: Core Token contract for CLARIFI protocol

;; traits
;;
(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
;;
;; No maximum supply - @dev: might need to change later
(define-fungible-token clf-token)

;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ft-mint? clf-token amount recipient)
    )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (try! (ft-transfer? clf-token amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

;; read only functions
;;
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

;; private functions
;;

