<?php
/**
 * AIC Exam Portal — OTP Proxy
 * Namecheap shared hosting PHP script
 * Keeps Notify.lk credentials server-side, never in browser JS.
 *
 * Place this file in your Namecheap public_html folder alongside index.html
 * URL will be: https://aigeneration.uk/otp-proxy.php
 */

// ── Credentials (server-side only) ───────────────────────────────────────────
define('NOTIFY_USER_ID',    '31549');
define('NOTIFY_API_KEY',    'qBrNNQ2qe7iPvqQRphWi');
define('NOTIFY_SERVICE_ID', 'NotifyDEMO');
define('NOTIFY_ENDPOINT',   'https://app.notify.lk/api/v1/send');

// ── Allowed origins ───────────────────────────────────────────────────────────
$allowed_origins = [
    'https://aigeneration.uk',
    'https://www.aigeneration.uk',
    'https://tecsrilankaworldwide.github.io',
];

// ── CORS headers ──────────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://aigeneration.uk");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Parse JSON body ───────────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);

if (!$body || empty($body['to']) || empty($body['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: to, message']);
    exit;
}

$to      = (string) $body['to'];
$message = (string) $body['message'];

// ── Validate phone (94XXXXXXXXX format) ──────────────────────────────────────
if (!preg_match('/^94[0-9]{9}$/', $to)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number. Use 94XXXXXXXXX format.']);
    exit;
}

// ── Validate message has 6-digit OTP ─────────────────────────────────────────
if (!preg_match('/\b\d{6}\b/', $message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid OTP message format']);
    exit;
}

// ── Forward to Notify.lk ──────────────────────────────────────────────────────
$params = http_build_query([
    'user_id'    => NOTIFY_USER_ID,
    'api_key'    => NOTIFY_API_KEY,
    'service_id' => NOTIFY_SERVICE_ID,
    'to'         => $to,
    'message'    => $message,
]);

$ch = curl_init(NOTIFY_ENDPOINT);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $params,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to reach Notify.lk', 'detail' => $curlError]);
    exit;
}

// Return Notify.lk response directly to browser
http_response_code($httpCode);
echo $response;
