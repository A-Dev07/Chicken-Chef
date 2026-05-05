<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

// Start session for all auth operations
if (session_status() === PHP_SESSION_NONE) session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── POST /auth.php?action=signup ───────────────────────────
if ($method === 'POST' && $action === 'signup') {
    $b = body();
    $name  = trim($b['name']  ?? '');
    $email = strtolower(trim($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    if (!$name || !$email || !$pass)               fail('Name, email and password are required.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Invalid email address.');
    if (mb_strlen($pass) < 6)                      fail('Password must be at least 6 characters.');

    try {
        $db   = getDB();
    } catch (Exception $e) {
        fail('Database connection failed. Check your config.php settings. Error: ' . $e->getMessage(), 500);
    }

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) fail('This email is already registered.', 409);

    $hash = password_hash($pass, PASSWORD_BCRYPT);

    // Use a two-step INSERT then SELECT (safer than RETURNING across PDO versions)
    $stmt = $db->prepare(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    );
    $stmt->execute([$name, $email, $hash]);
    $newId = (int) $db->lastInsertId();

    // Fetch the created user
    $stmt = $db->prepare('SELECT id, name, email FROM users WHERE id = ?');
    $stmt->execute([$newId]);
    $user = $stmt->fetch();

    if (!$user) fail('Signup succeeded but user could not be retrieved.', 500);

    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    ok(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']], 201);
}

// ── POST /auth.php?action=login ────────────────────────────
if ($method === 'POST' && $action === 'login') {
    $b     = body();
    $email = strtolower(trim($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    if (!$email || !$pass) fail('Email and password are required.');

    try {
        $db = getDB();
    } catch (Exception $e) {
        fail('Database connection failed. Check your config.php settings. Error: ' . $e->getMessage(), 500);
    }

    $stmt = $db->prepare(
        'SELECT id, name, email, password_hash FROM users WHERE email = ?'
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($pass, $user['password_hash'])) {
        fail('Invalid email or password.', 401);
    }

    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    ok(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]);
}

// ── POST /auth.php?action=logout ───────────────────────────
if ($method === 'POST' && $action === 'logout') {
    session_destroy();
    ok('Logged out successfully.');
}

// ── GET /auth.php?action=me ────────────────────────────────
if ($method === 'GET' && $action === 'me') {
    $userId = requireAuth();
    try {
        $db = getDB();
    } catch (Exception $e) {
        fail('Database connection failed.', 500);
    }
    $stmt = $db->prepare(
        'SELECT id, name, email, phone, created_at FROM users WHERE id = ?'
    );
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) fail('User not found.', 404);
    ok($user);
}

fail('Invalid action or method.', 400);
