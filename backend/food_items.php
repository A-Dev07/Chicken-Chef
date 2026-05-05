<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed.', 405);

$db   = getDB();
$rows = $db->query(
    "SELECT id, name, price, category, type, image_url,
            ingredients, recipe
     FROM food_items
     ORDER BY id"
)->fetchAll();

// ingredients is a PostgreSQL text[] – convert from "{a,b,c}" string to array
foreach ($rows as &$row) {
    $raw = $row['ingredients'] ?? '{}';
    // Strip braces and split on comma, respecting quoted items
    $inner  = trim($raw, '{}');
    $items  = $inner === '' ? [] : str_getcsv($inner, ',', '"');
    $row['ingredients'] = array_map('trim', $items);
    $row['price']       = (float) $row['price'];
    $row['image']       = $row['image_url'];
    unset($row['image_url']);
}

ok($rows);
