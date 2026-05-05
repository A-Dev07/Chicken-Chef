<?php
// ── Database Configuration ─────────────────────────────────
// Change these values to match your PostgreSQL setup
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '5432');
define('DB_NAME', 'chicken_chef');
define('DB_USER', 'postgres');        // your PostgreSQL username
define('DB_PASS', 'postgres');        // your PostgreSQL password

// ── Singleton PDO connection ───────────────────────────────
function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    // Check that the pdo_pgsql extension is loaded
    if (!extension_loaded('pdo_pgsql')) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'PHP extension pdo_pgsql is not loaded. Enable it in your php.ini.',
        ]);
        exit;
    }

    $dsn = sprintf(
        'pgsql:host=%s;port=%s;dbname=%s',
        DB_HOST, DB_PORT, DB_NAME
    );

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Database connection failed: ' . $e->getMessage() .
                         ' — Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS in config.php.',
        ]);
        exit;
    }

    return $pdo;
}
