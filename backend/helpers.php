<?php
// ── Response helpers ────────────────────────────────────────
function ok(mixed $data = null, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

function fail(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

// ── Auth guard ─────────────────────────────────────────────
// Returns the authenticated user_id or terminates with 401
function requireAuth(): int {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['user_id'])) fail('Unauthorized. Please log in.', 401);
    return (int) $_SESSION['user_id'];
}

// ── JSON body parser ────────────────────────────────────────
function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
