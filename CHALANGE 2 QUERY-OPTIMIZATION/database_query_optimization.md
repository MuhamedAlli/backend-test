# Database Query Optimization

## Objective

Write optimized SQL/NoSQL queries to retrieve product data efficiently.

---

## Requirements

### SQL Query (PostgreSQL)

#### Objective:

Retrieve products with a price between $50 and $200, ordered by price (ascending) with pagination (10 products per page).

#### Query:

```sql
SELECT id, name, description, price, thumbnail, categoryId
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC
LIMIT 10 OFFSET :offset;
```

- `LIMIT 10`: Restricts the results to 10 products per page.
- `OFFSET :offset`: Skips the number of rows based on the current page (`OFFSET = (pageNumber - 1) * 10`).

#### Optimization:

- **Indexing**:

  - Create an index on the `price` column to speed up range queries and ordering:
    ```sql
    CREATE INDEX idx_products_price ON products(price);
    ```

- **Caching**:
  - Use a caching mechanism (e.g., Redis) to store frequently queried results for a fixed range and offset.

---

### NoSQL Query (MongoDB)

#### Objective:

Retrieve products by category (e.g., "Electronics"), sorted by price in descending order, limited to 5 products per page.

#### Query:

```javascript
db.products
  .find({ category: "Electronics" })
  .sort({ price: -1 }) // Descending order
  .skip((pageNumber - 1) * 5) // Pagination offset
  .limit(5);
```

#### Optimization:

- **Indexing**:

  - Create a compound index on `category` and `price`:
    ```javascript
    db.products.createIndex({ category: 1, price: -1 });
    ```

- **Caching**:
  - Cache the results for common queries like "Electronics, sorted by price."

---

### Sequelize Models for SQL Query

#### Query with Sequelize:

```javascript
const products = await Product.findAll({
  where: {
    price: {
      [Op.between]: [50, 200],
    },
  },
  order: [["price", "ASC"]],
  limit: 10,
  offset: (pageNumber - 1) * 10,
  attributes: ["id", "name", "description", "price", "thumbnail", "categoryId"],
});
```

---

### Mongoose Models for NoSQL Query

#### Query with Mongoose:

const products = await Product.find({ category: "Electronics" })
.sort({ price: -1 })
.skip((pageNumber - 1) \* 5)
.limit(5);

```

---

## General Optimization Strategies

#### **Indexing**:

- Create indexes for frequently queried fields (e.g., `price`, `category`).

#### **Query Execution Plans**:

- Use tools like `EXPLAIN` in PostgreSQL to analyze and optimize query execution.

#### **Caching**:

- Cache query results for repetitive requests using tools like Redis or Memcached.
```
