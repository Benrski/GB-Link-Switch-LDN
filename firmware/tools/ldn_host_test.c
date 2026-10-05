/* Host test: the LDN host core round-trips against the joiner code in ldn_keys.c.
   The encoded advertisement decodes to the same room, the joiner's request parses and
   verifies, and the host's response is accepted by the joiner. The Wi-Fi glue in
   ldn_host.c is compiled out (no ESP_PLATFORM); only encode/parse/build run.

   NVS keys and esp_random are stubbed: a deterministic PRNG and a fixed synthetic
   16-byte value per key name, never real console key material. Pia crypto primitives
   use OpenSSL. Build and run from the firmware directory:

       cc -std=c11 -Wall -Wextra -I tools/host_stubs -I common \
           tools/ldn_host_test.c common/ldn_keys.c -lcrypto -o /tmp/ldn_host_test \
           && /tmp/ldn_host_test
*/

#include <openssl/evp.h>
#include <openssl/params.h>

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "nvs.h"
#include "esp_random.h"
#include "pia_crypto.h"

/* ---- Pia crypto primitives, backed by OpenSSL ---------------------------------- */

void pia_ecb(const uint8_t key[16], const uint8_t in[16], uint8_t out[16], bool encrypt)
{
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    int len = 0;
    EVP_CipherInit_ex(ctx, EVP_aes_128_ecb(), NULL, key, NULL, encrypt ? 1 : 0);
    EVP_CIPHER_CTX_set_padding(ctx, 0);
    EVP_CipherUpdate(ctx, out, &len, in, 16);
    EVP_CipherFinal_ex(ctx, out + len, &len);
    EVP_CIPHER_CTX_free(ctx);
}

void pia_sha256(const uint8_t *data, size_t len, uint8_t out[32])
{
    unsigned int n = 0;
    EVP_Digest(data, len, out, &n, EVP_sha256(), NULL);
}

void pia_hmac_sha256(const uint8_t *key, size_t key_len, const uint8_t *data, size_t len, uint8_t out[32])
{
    EVP_MAC *mac = EVP_MAC_fetch(NULL, "HMAC", NULL);
    EVP_MAC_CTX *ctx = EVP_MAC_CTX_new(mac);
    OSSL_PARAM params[] = {OSSL_PARAM_construct_utf8_string("digest", "SHA256", 0),
                           OSSL_PARAM_construct_end()};
    size_t out_len = 0;
    EVP_MAC_init(ctx, key, key_len, params);
    EVP_MAC_update(ctx, data, len);
    EVP_MAC_final(ctx, out, &out_len, 32);
    EVP_MAC_CTX_free(ctx);
    EVP_MAC_free(mac);
}

bool pia_gcm(const uint8_t *key, size_t key_len, const uint8_t *nonce, size_t nonce_len,
             const uint8_t *aad, size_t aad_len, const uint8_t *in, size_t in_len,
             uint8_t *out, uint8_t *tag, size_t tag_len, bool encrypt)
{
    if (key_len != 16) return false;
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx) return false;
    bool ok = false;
    int len = 0, tmp = 0, fin = 0;
    if (EVP_CipherInit_ex(ctx, EVP_aes_128_gcm(), NULL, NULL, NULL, encrypt ? 1 : 0) &&
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, (int)nonce_len, NULL) &&
        EVP_CipherInit_ex(ctx, NULL, NULL, key, nonce, encrypt ? 1 : 0))
    {
        if (aad_len) EVP_CipherUpdate(ctx, NULL, &tmp, aad, (int)aad_len);
        if (!encrypt) EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, (int)tag_len, tag);
        if (EVP_CipherUpdate(ctx, out, &len, in, (int)in_len) &&
            EVP_CipherFinal_ex(ctx, out + len, &fin))
            ok = encrypt ? EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, (int)tag_len, tag) == 1 : true;
    }
    EVP_CIPHER_CTX_free(ctx);
    return ok;
}

void pia_ctr(const uint8_t key[16], const uint8_t nonce4[4], const uint8_t *in, size_t len, uint8_t *out)
{
    uint8_t counter[16] = {0}, mask[16];
    memcpy(counter, nonce4, 4);
    for (size_t i = 0; i < len; i += 16)
    {
        pia_ecb(key, counter, mask, true);
        size_t n = len - i < 16 ? len - i : 16;
        for (size_t j = 0; j < n; ++j) out[i + j] = (uint8_t)(in[i + j] ^ mask[j]);
        for (int j = 15; j >= 4 && ++counter[j] == 0; --j) { }
    }
}

/* ---- NVS + esp_random stubs ----------------------------------------------------- */

static uint32_t g_rng = 0x1234abcdu;
uint32_t esp_random(void) { g_rng = g_rng * 1664525u + 1013904223u; return g_rng; }
void esp_fill_random(void *buf, size_t len)
{
    uint8_t *p = buf;
    for (size_t i = 0; i < len; ++i) p[i] = (uint8_t)(esp_random() >> 16);
}

esp_err_t nvs_open(const char *namespace_name, nvs_open_mode_t mode, nvs_handle_t *out_handle)
{
    (void)namespace_name; (void)mode;
    *out_handle = 1;
    return ESP_OK;
}
void nvs_close(nvs_handle_t handle) { (void)handle; }
esp_err_t nvs_get_blob(nvs_handle_t handle, const char *key, void *out_value, size_t *length)
{
    (void)handle;
    if (!length || *length < 16) return -1;
    uint8_t *o = out_value;
    size_t kl = strlen(key);
    for (int i = 0; i < 16; ++i) o[i] = (uint8_t)(0xa0 ^ key[i % kl] ^ (i * 7));   /* synthetic, not a real key */
    *length = 16;
    return ESP_OK;
}
esp_err_t nvs_set_blob(nvs_handle_t h, const char *k, const void *v, size_t n) { (void)h;(void)k;(void)v;(void)n; return ESP_OK; }
esp_err_t nvs_commit(nvs_handle_t h) { (void)h; return ESP_OK; }
esp_err_t nvs_erase_all(nvs_handle_t h) { (void)h; return ESP_OK; }

/* Code under test. Wi-Fi glue is ESP_PLATFORM-gated. */
#include "../common/ldn_host.c"
#include "ldn_keys.h"

/* ---- test harness --------------------------------------------------------------- */

static int g_failures;
static uint8_t g_work[LDN_HOST_WORK];
#define CHECK(cond) do { \
    if (cond) { printf("  ok   %s\n", #cond); } \
    else { printf("  FAIL %s (line %d)\n", #cond, __LINE__); ++g_failures; } \
} while (0)

#define COMM_ID 0x01006fa0233f8000ULL

static void build_room(ldn_network_t *net)
{
    memset(net, 0, sizeof(*net));
    net->protocol = 3;
    net->version = 4;
    net->channel = 6;
    net->security = 1;
    net->policy = 0;
    net->app_version = 0x0203;
    net->maximum = 4;
    net->communication_id = COMM_ID;
    net->challenge = 0x0123456789abcdefULL;
    for (int i = 0; i < 16; ++i) { net->ssid[i] = (uint8_t)(0x10 + i); net->random[i] = (uint8_t)(0x20 + i); }
    bin_wb64(net->id, net->communication_id);
    memcpy(net->id + 16, net->ssid, 16);            /* id[8..16] stays zero */

    uint8_t host_mac[6] = {0x02, 0x11, 0x22, 0x33, 0x44, 0x55};
    uint8_t join_mac[6] = {0x06, 0xaa, 0xbb, 0xcc, 0xdd, 0xee};
    memcpy(net->host, host_mac, 6);
    net->member_count = 2;
    memcpy(net->members[0].mac, host_mac, 6);
    snprintf(net->members[0].ip, sizeof(net->members[0].ip), "169.254.37.1");
    snprintf(net->members[0].name, sizeof(net->members[0].name), "SW-HOST");
    net->members[0].index = 0;
    memcpy(net->members[1].mac, join_mac, 6);
    snprintf(net->members[1].ip, sizeof(net->members[1].ip), "169.254.37.2");
    snprintf(net->members[1].name, sizeof(net->members[1].name), "EMU");
    net->members[1].index = 1;
    net->members[1].platform = 1;

    for (int i = 0; i < 24; ++i) net->app_data[i] = (uint8_t)(0x40 + i);
    net->app_data_len = 24;
}

static const ldn_member_t *member_by_index(const ldn_network_t *net, int index)
{
    for (int i = 0; i < net->member_count; ++i)
        if (net->members[i].index == index) return &net->members[i];
    return NULL;
}

static void test_advertisement(const ldn_network_t *net)
{
    printf("advertisement round-trip:\n");
    uint8_t nonce4[4] = {0x01, 0x02, 0x03, 0x04};
    static uint8_t raw[1024];
    int len = ldn_host_encode_advertisement(net, nonce4, raw, sizeof(raw), g_work);
    CHECK(len > 0);
    if (len <= 0) return;

    ldn_network_t decoded;
    CHECK(ldn_decode_advertisement(raw, (size_t)len, net->host, net->channel, &decoded));
    CHECK(decoded.channel == net->channel);
    CHECK(decoded.communication_id == net->communication_id);
    CHECK(decoded.challenge == net->challenge);
    CHECK(decoded.app_version == net->app_version);
    CHECK(decoded.maximum == net->maximum);
    CHECK(decoded.security == 1);
    CHECK(memcmp(decoded.ssid, net->ssid, 16) == 0);
    CHECK(decoded.member_count == net->member_count);
    CHECK(decoded.app_data_len == net->app_data_len);
    CHECK(memcmp(decoded.app_data, net->app_data, (size_t)net->app_data_len) == 0);

    for (int i = 0; i < net->member_count; ++i)
    {
        const ldn_member_t *want = &net->members[i];
        const ldn_member_t *got = member_by_index(&decoded, want->index);
        CHECK(got != NULL);
        if (!got) continue;
        CHECK(memcmp(got->mac, want->mac, 6) == 0);
        CHECK(strcmp(got->ip, want->ip) == 0);
        CHECK(strcmp(got->name, want->name) == 0);
        CHECK(got->platform == want->platform);
    }
}

static void test_authentication(const ldn_network_t *net)
{
    printf("authentication round-trip:\n");
    ldn_auth_t auth;
    CHECK(ldn_auth_begin(&auth, net));

    ldn_host_request_t req;
    CHECK(ldn_host_parse_request(net, auth.request, (size_t)auth.request_len, &req, g_work));
    CHECK(strcmp(req.name, "GBLINK") == 0);
    CHECK(req.app_version == net->app_version);
    CHECK(memcmp(req.joiner_random, auth.random, 16) == 0);
    CHECK(memcmp(req.nonce, auth.nonce, 8) == 0);
    CHECK(memcmp(req.device, auth.device, 8) == 0);

    static const uint8_t host_device[8] = {1, 2, 3, 4, 5, 6, 7, 8};
    static uint8_t response[512];
    int len = ldn_host_build_response(net, &req, host_device, false, response, sizeof(response), g_work);
    CHECK(len == 78 + 388 + 16);
    CHECK(ldn_auth_accept(&auth, response, (size_t)len));

    static uint8_t followup[256];
    int len2 = ldn_host_build_response(net, &req, host_device, true, followup, sizeof(followup), g_work);
    CHECK(len2 == 78 + 132 + 16);
    CHECK(ldn_auth_accept(&auth, followup, (size_t)len2));   /* accepted once verified */
}

static void test_rejections(const ldn_network_t *net)
{
    printf("rejections:\n");
    ldn_auth_t auth;
    CHECK(ldn_auth_begin(&auth, net));
    ldn_host_request_t req;
    CHECK(ldn_host_parse_request(net, auth.request, (size_t)auth.request_len, &req, g_work));

    /* Challenge mismatch with the room: refused. */
    ldn_network_t other = *net;
    other.challenge ^= 1;
    ldn_host_request_t bad;
    CHECK(!ldn_host_parse_request(&other, auth.request, (size_t)auth.request_len, &bad, g_work));

    /* Corrupted ciphertext: joiner's GCM tag check fails. */
    static const uint8_t host_device[8] = {1, 2, 3, 4, 5, 6, 7, 8};
    static uint8_t response[512];
    int len = ldn_host_build_response(net, &req, host_device, false, response, sizeof(response), g_work);
    CHECK(len > 0);
    response[100] ^= 0xff;
    CHECK(!ldn_auth_accept(&auth, response, (size_t)len));
}

int main(void)
{
    ldn_network_t net;
    build_room(&net);
    test_advertisement(&net);
    test_authentication(&net);
    test_rejections(&net);
    printf(g_failures ? "\n%d check(s) FAILED\n" : "\nall checks passed\n", g_failures);
    return g_failures ? 1 : 0;
}
