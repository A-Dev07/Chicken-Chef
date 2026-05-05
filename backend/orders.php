<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$userId = requireAuth();   // Guards every request – returns user_id or exits 401
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── POST /orders.php – Place a new order ──────────────────
if ($method === 'POST') {
    $b       = body();
    $items   = $b['items']   ?? [];
    $address = trim($b['address'] ?? '');
    $total   = (float)($b['total'] ?? 0);

    if (empty($items))  fail('Cart is empty.');
    if ($total <= 0)    fail('Invalid order total.');

    $db->beginTransaction();
    try {
        // Insert order header
        $stmt = $db->prepare(
            'INSERT INTO orders (user_id, total_amount, delivery_address)
             VALUES (?, ?, ?)
             RETURNING id, created_at'
        );
        $stmt->execute([$userId, $total, $address]);
        $order = $stmt->fetch();

        // Insert line items
        $lineStmt = $db->prepare(
            'INSERT INTO order_items (order_id, food_item_id, food_name, food_price, quantity)
             VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $lineStmt->execute([
                $order['id'],
                (int)($item['id'] ?? 0),
                (string)($item['name'] ?? ''),
                (float)($item['price'] ?? 0),
                (int)($item['quantity'] ?? 1),
            ]);
        }

        $db->commit();

        ok([
            'order_id'   => $order['id'],
            'created_at' => $order['created_at'],
        ], 201);

    } catch (Throwable $e) {
        $db->rollBack();
        fail('Failed to place order: ' . $e->getMessage(), 500);
    }
}

// ── GET /orders.php – Fetch order history for the user ───
if ($method === 'GET') {
    $stmt = $db->prepare(
        "SELECT
            o.id,
            o.total_amount,
            o.status,
            o.delivery_address,
            o.created_at,
            json_agg(
                json_build_object(
                    'name',     oi.food_name,
                    'price',    oi.food_price,
                    'quantity', oi.quantity
                ) ORDER BY oi.id
            ) AS items
         FROM orders      o
         JOIN order_items oi ON oi.order_id = o.id
         WHERE o.user_id = ?
         GROUP BY o.id
         ORDER BY o.created_at DESC"
    );
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll();

    // json_agg returns a JSON string inside the row – decode it
    foreach ($orders as &$row) {
        $row['items'] = json_decode($row['items'], true);
    }

    ok($orders);
}

fail('Method not allowed.', 405);
