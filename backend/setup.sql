-- ============================================================
-- Chicken Chef – PostgreSQL Database Setup
-- Run:  psql -U postgres -f setup.sql
-- ============================================================

-- Create database (skip if it already exists)
SELECT 'CREATE DATABASE chicken_chef'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chicken_chef')\gexec

\c chicken_chef;

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL        PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    phone         VARCHAR(20),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS food_items (
    id          SERIAL          PRIMARY KEY,
    name        VARCHAR(150)    NOT NULL,
    price       DECIMAL(10, 2)  NOT NULL,
    category    VARCHAR(50),
    type        VARCHAR(10),          -- 'veg' | 'non-veg'
    image_url   TEXT,
    ingredients TEXT[],               -- PostgreSQL native array
    recipe      TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id               SERIAL          PRIMARY KEY,
    user_id          INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount     DECIMAL(10, 2)  NOT NULL,
    status           VARCHAR(30)     NOT NULL DEFAULT 'confirmed',
    delivery_address TEXT,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id           SERIAL          PRIMARY KEY,
    order_id     INTEGER         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id INTEGER,                        -- nullable – item may be removed later
    food_name    VARCHAR(150)    NOT NULL,
    food_price   DECIMAL(10, 2)  NOT NULL,
    quantity     INTEGER         NOT NULL DEFAULT 1
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ── Seed: Food Items ─────────────────────────────────────────
-- Insert only if the table is empty to allow safe re-runs
INSERT INTO food_items (name, price, category, type, image_url, ingredients, recipe)
SELECT * FROM (VALUES

  ('Chicken Biryani', 299, 'Non-Veg', 'non-veg',
   'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1080',
   ARRAY['Basmati Rice (2 cups)','Chicken (500g)','Yogurt (1 cup)','Onions (3 large)',
         'Tomatoes (2 medium)','Ginger-Garlic Paste (2 tbsp)','Biryani Masala (2 tbsp)',
         'Saffron strands','Mint leaves','Coriander leaves','Green chilies','Ghee (4 tbsp)'],
   '1. Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes.
2. Soak rice in water for 30 minutes, then parboil it with whole spices.
3. Deep fry sliced onions until golden brown.
4. In a heavy-bottomed pot, layer marinated chicken at the bottom.
5. Add a layer of fried onions, mint, and coriander.
6. Top with parboiled rice.
7. Sprinkle saffron soaked in milk, remaining fried onions, and ghee.
8. Cover and cook on dum (low heat) for 45 minutes.
9. Garnish with boiled eggs and serve with raita.'),

  ('Paneer Tikka', 249, 'Veg', 'veg',
   'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1080',
   ARRAY['Paneer cubes (300g)','Thick yogurt (1/2 cup)','Bell peppers (2 colors)',
         'Onions (2 medium)','Ginger-Garlic paste (1 tbsp)','Tikka masala (2 tbsp)',
         'Kashmiri red chili powder','Turmeric powder','Garam masala',
         'Lemon juice (2 tbsp)','Mustard oil (2 tbsp)','Chaat masala for garnish'],
   '1. Cut paneer into cubes and soak in hot water for 10 minutes.
2. Mix yogurt with all spices, ginger-garlic paste, and lemon juice.
3. Add paneer cubes, bell peppers, and onions to the marinade.
4. Marinate for at least 2 hours in the refrigerator.
5. Thread marinated paneer and vegetables onto skewers.
6. Preheat oven to 200°C or prepare a grill.
7. Brush with oil and grill for 15-20 minutes, turning occasionally.
8. Garnish with chaat masala and lemon wedges.
9. Serve hot with mint chutney.'),

  ('Butter Chicken', 329, 'Non-Veg', 'non-veg',
   'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1080',
   ARRAY['Chicken (700g boneless)','Butter (100g)','Fresh cream (1 cup)',
         'Tomato puree (2 cups)','Kasuri methi','Ginger-Garlic paste (2 tbsp)',
         'Red chili powder (1 tsp)','Garam masala (1 tsp)','Kashmiri red chili',
         'Honey (1 tbsp)','Yogurt (1/2 cup)','Salt to taste'],
   '1. Marinate chicken with yogurt, ginger-garlic paste, and spices for 1 hour.
2. Grill or pan-fry the chicken pieces until slightly charred.
3. In a pan, melt butter and add tomato puree.
4. Cook the tomato puree until oil separates (about 10 minutes).
5. Add red chili powder, garam masala, and salt.
6. Add the grilled chicken pieces to the gravy.
7. Pour in fresh cream and mix well.
8. Crush kasuri methi between your palms and add to the curry.
9. Simmer for 5-10 minutes.
10. Garnish with cream and serve with naan or rice.'),

  ('Masala Dosa', 149, 'Veg', 'veg',
   'https://images.unsplash.com/photo-1743517894265-c86ab035adef?w=1080',
   ARRAY['Dosa batter (2 cups)','Potatoes (4 large, boiled)','Onions (2 medium)',
         'Green chilies (3-4)','Mustard seeds (1 tsp)','Curry leaves','Turmeric powder',
         'Ginger (1 inch, grated)','Oil for cooking','Salt to taste',
         'Coriander leaves for garnish'],
   '1. Prepare dosa batter by soaking rice and urad dal overnight, then grind and ferment.
2. For filling: Heat oil, add mustard seeds and curry leaves.
3. Add chopped onions, green chilies, and ginger. Saute until golden.
4. Add turmeric and mashed potatoes. Mix well and cook for 5 minutes.
5. Heat a flat griddle and spread a thin layer of batter in circular motion.
6. Drizzle oil around the edges and let it cook until crispy.
7. Place potato filling in the center of the dosa.
8. Fold the dosa or roll it into a cylinder.
9. Serve hot with coconut chutney and sambar.'),

  ('French Fries', 99, 'Snacks', 'veg',
   'https://images.unsplash.com/photo-1599211469310-9b0b50a2955a?w=1080',
   ARRAY['Potatoes (4 large)','Oil for deep frying','Salt to taste','Paprika (1 tsp)',
         'Garlic powder (1/2 tsp)','Mixed herbs (optional)'],
   '1. Peel and cut potatoes into even sticks (about 1 cm thick).
2. Soak in cold water for 30 minutes to remove starch.
3. Dry the potato sticks thoroughly with a kitchen towel.
4. Heat oil to 160C and fry for 5 minutes (first fry).
5. Remove and let them rest for 10 minutes.
6. Heat oil to 190C and fry until golden and crispy (3-4 minutes).
7. Drain on paper towels and season immediately with salt and paprika.
8. Serve hot with ketchup or mayo.')

) AS v(name, price, category, type, image_url, ingredients, recipe)
WHERE NOT EXISTS (SELECT 1 FROM food_items LIMIT 1);

-- Confirmation
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS food_items_seeded FROM food_items;
