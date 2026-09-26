#pragma once
/* Just enough of the PSA crypto API for pia_crypto.c to build on a host. The test
   (tools/pia_host_test.c) implements these with OpenSSL; the firmware uses mbedtls. */
#include <stddef.h>
#include <stdint.h>

typedef int32_t psa_status_t;
#define PSA_SUCCESS 0
typedef uint32_t psa_algorithm_t;
typedef uint32_t psa_key_usage_t;
typedef uint16_t psa_key_type_t;
typedef uint32_t mbedtls_svc_key_id_t;
typedef struct { psa_key_usage_t usage; psa_algorithm_t alg; psa_key_type_t type; size_t bits; } psa_key_attributes_t;
#define PSA_KEY_ATTRIBUTES_INIT {0, 0, 0, 0}

#define PSA_KEY_USAGE_ENCRYPT 1u
#define PSA_KEY_USAGE_DECRYPT 2u
#define PSA_KEY_USAGE_SIGN_MESSAGE 4u
#define PSA_KEY_TYPE_AES 1
#define PSA_KEY_TYPE_HMAC 2
#define PSA_ALG_ECB_NO_PADDING 0x01u
#define PSA_ALG_GCM 0x02u
#define PSA_ALG_SHA_256 0x03u
#define PSA_ALG_HMAC(hash) (0x100u | (hash))
#define PSA_ALG_AEAD_WITH_SHORTENED_TAG(alg, tag) ((alg) | (psa_algorithm_t)(tag) << 16)
#define PSA_ALG_AEAD_TAG_LENGTH(alg) (((alg) >> 16) & 0x3fu)

psa_status_t psa_crypto_init(void);
static inline void psa_set_key_usage_flags(psa_key_attributes_t *a, psa_key_usage_t usage) { a->usage = usage; }
static inline void psa_set_key_algorithm(psa_key_attributes_t *a, psa_algorithm_t alg) { a->alg = alg; }
static inline void psa_set_key_type(psa_key_attributes_t *a, psa_key_type_t type) { a->type = type; }
static inline void psa_set_key_bits(psa_key_attributes_t *a, size_t bits) { a->bits = bits; }
psa_status_t psa_import_key(const psa_key_attributes_t *attributes, const uint8_t *data, size_t length,
                            mbedtls_svc_key_id_t *key);
psa_status_t psa_destroy_key(mbedtls_svc_key_id_t key);
psa_status_t psa_cipher_encrypt(mbedtls_svc_key_id_t key, psa_algorithm_t alg, const uint8_t *input,
                                size_t input_length, uint8_t *output, size_t output_size, size_t *output_length);
psa_status_t psa_cipher_decrypt(mbedtls_svc_key_id_t key, psa_algorithm_t alg, const uint8_t *input,
                                size_t input_length, uint8_t *output, size_t output_size, size_t *output_length);
psa_status_t psa_aead_encrypt(mbedtls_svc_key_id_t key, psa_algorithm_t alg, const uint8_t *nonce,
                              size_t nonce_length, const uint8_t *additional_data, size_t additional_data_length,
                              const uint8_t *plaintext, size_t plaintext_length, uint8_t *ciphertext,
                              size_t ciphertext_size, size_t *ciphertext_length);
psa_status_t psa_aead_decrypt(mbedtls_svc_key_id_t key, psa_algorithm_t alg, const uint8_t *nonce,
                              size_t nonce_length, const uint8_t *additional_data, size_t additional_data_length,
                              const uint8_t *ciphertext, size_t ciphertext_length, uint8_t *plaintext,
                              size_t plaintext_size, size_t *plaintext_length);
psa_status_t psa_hash_compute(psa_algorithm_t alg, const uint8_t *input, size_t input_length, uint8_t *hash,
                              size_t hash_size, size_t *hash_length);
psa_status_t psa_mac_compute(mbedtls_svc_key_id_t key, psa_algorithm_t alg, const uint8_t *input,
                             size_t input_length, uint8_t *mac, size_t mac_size, size_t *mac_length);
