// ===================================================
// CENTRAL DATA STORE — accurate architecture data
// based on actual codebase + deployment screenshots
// ===================================================

export const SERVICES = [
  {
    id: 'auth',
    name: 'Auth Service',
    color: '#4f9eff',
    port: 8001,
    tech: 'Node.js + Express',
    db: 'PostgreSQL',
    replicas: 2,
    desc: 'Authentication & authorization. Manages Admin, Manager, Customer roles. Handles tenants (created by Admin), multi-manager per tenant. JWT access + refresh token rotation.',
    repo: 'pizza-delivery-app-auth-service',
    keyFiles: ['routes/auth.ts', 'routes/tenant.ts', 'routes/user.ts', 'models/User.ts', 'models/Tenant.ts', 'middlewares/auth.ts', 'Dockerfile'],
    envVars: ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME', 'PORT'],
    kafkaProduces: [],
    kafkaConsumes: [],
    notes: 'PostgreSQL for relational user-tenant-role data. Three roles: ADMIN (global), MANAGER (tenant-scoped), CUSTOMER.',
  },
  {
    id: 'catalog',
    name: 'Catalog Service',
    color: '#ff6b2b',
    port: 8002,
    tech: 'Node.js + Express',
    db: 'MongoDB',
    replicas: 2,
    desc: 'Products, categories, toppings CRUD. Tenant-scoped management by Admins & Managers. Publishes Kafka events on every create/update/delete. Images stored in AWS S3.',
    repo: 'pizza-delivery-catalog-service',
    keyFiles: ['models/Product.ts', 'models/Category.ts', 'models/Topping.ts', 'routes/catalog.ts', 'kafka/producer.ts', 'seed/index.ts'],
    envVars: ['MONGO_URI', 'PORT', 'ADMIN_JWT_SECRET', 'KAFKA_BROKER', 'S3_BUCKET', 'AWS_ACCESS_KEY'],
    kafkaProduces: ['PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'TOPPING_CREATED', 'TOPPING_UPDATED', 'TOPPING_DELETED'],
    kafkaConsumes: [],
    notes: 'Pushes Kafka events for every product/topping mutation so Order Service cache stays in sync.',
  },
  {
    id: 'order',
    name: 'Order Service',
    color: '#ffb347',
    port: 8003,
    tech: 'Node.js + Express',
    db: 'MongoDB',
    replicas: 3,
    desc: 'Order lifecycle. Maintains local product/topping cache from Kafka. Validates prices from cache at placement. Integrates Stripe for card payments + handles Stripe webhooks.',
    repo: 'pizza-delivery-order-service',
    keyFiles: ['models/Order.ts', 'models/ProductCache.ts', 'models/Customer.ts', 'routes/order.ts', 'kafka/producer.ts', 'kafka/consumer.ts', 'payment/stripe.ts'],
    envVars: ['MONGO_URI', 'PORT', 'JWT_SECRET', 'KAFKA_BROKER', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
    kafkaProduces: ['ORDER_PLACED', 'ORDER_STATUS_CHANGED', 'PAYMENT_COMPLETED'],
    kafkaConsumes: ['PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'TOPPING_CREATED', 'TOPPING_UPDATED', 'TOPPING_DELETED'],
    notes: 'Caches minimal product + topping data from Kafka. On order: confirms prices from cache, processes order. If paymentMode=CARD → returns Stripe URL.',
  },
  {
    id: 'ws',
    name: 'WebSocket Service',
    color: '#2ecc71',
    port: 8004,
    tech: 'Node.js + Socket.io',
    db: 'In-memory',
    replicas: 2,
    desc: 'Real-time UI updates. Consumes Kafka events and forwards to the correct UI room. Admin Dashboard gets order notifications in real-time.',
    repo: 'pizza-delivery-websocket-service',
    keyFiles: ['socket/handlers.ts', 'kafka/consumer.ts', 'server.ts'],
    envVars: ['PORT', 'KAFKA_BROKER', 'CORS_ORIGIN'],
    kafkaProduces: [],
    kafkaConsumes: ['ORDER_PLACED', 'ORDER_STATUS_CHANGED', 'PAYMENT_COMPLETED'],
    notes: 'Admin UI ↔ WS Service bidirectional. When order is created, manager gets notified instantly in Admin Dashboard.',
  },
  {
    id: 'notif',
    name: 'Notification Service',
    color: '#9b59b6',
    port: 8005,
    tech: 'Node.js + Nodemailer',
    db: 'Stateless (SMTP)',
    replicas: 1,
    desc: 'Consumes Kafka events and sends notifications. ORDER_PLACED → order confirmation email to customer via SMTP.',
    repo: 'pizza-app-notification-service',
    keyFiles: ['kafka/consumer.ts', 'mail/sender.ts', 'templates/orderConfirmation.html'],
    envVars: ['KAFKA_BROKER', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_PORT'],
    kafkaProduces: [],
    kafkaConsumes: ['ORDER_PLACED', 'ORDER_STATUS_CHANGED'],
    notes: 'Stateless Kafka consumer. On ORDER_PLACED → sends HTML order confirmation email.',
  },
]

export const FRONTENDS = [
  {
    id: 'client',
    name: 'Client UI',
    color: '#4f9eff',
    tech: 'Next.js 14 (App Router)',
    host: 'Vercel',
    domain: 'mern-pizza-app.cyou',
    repo: 'pizza-delivery-client-UI',
    keyFiles: ['app/page.tsx', 'app/cart/page.tsx', 'app/orders/page.tsx', 'components/PizzaCard.tsx', 'components/Cart.tsx', 'components/OrderTracker.tsx'],
    desc: 'Customer-facing ordering UI. Pizza + toppings customization, cart, Stripe checkout redirect, real-time order tracking via WebSocket.',
  },
  {
    id: 'admin',
    name: 'Admin Dashboard',
    color: '#ffb347',
    tech: 'React + Vite',
    host: 'Vercel',
    domain: 'admin.mern-pizza-app.cyou',
    repo: 'pizza-app-admin-dashboard',
    keyFiles: ['pages/Products.tsx', 'pages/Tenants.tsx', 'pages/Orders.tsx', 'pages/Managers.tsx', 'hooks/useSocket.ts'],
    desc: 'Multi-tenant admin & manager panel. Create tenants (admin), manage products/toppings, real-time order notifications via WebSocket.',
  },
]

export const EXTERNAL_SERVICES = [
  { id: 's3',     name: 'AWS S3',  color: '#ff9900', desc: 'Product & topping image storage. Catalog service uploads images.',     icon: '🪣' },
  { id: 'stripe', name: 'Stripe',  color: '#6772e5', desc: 'Card payment processing. Order service returns Stripe URL, handles webhooks.', icon: '💳' },
  { id: 'smtp',   name: 'SMTP',    color: '#ea4335', desc: 'Email delivery. Notification service sends order emails via Nodemailer.', icon: '📧' },
]

export const ENDPOINTS = {
  auth: [
    { method: 'POST',   path: '/api/auth/register',      desc: 'Register new customer',                          auth: false },
    { method: 'POST',   path: '/api/auth/login',          desc: 'Login → JWT access + refreshToken cookie',       auth: false },
    { method: 'POST',   path: '/api/auth/refresh',        desc: 'Rotate refresh token',                           auth: false },
    { method: 'POST',   path: '/api/auth/logout',         desc: 'Invalidate refresh token',                       auth: true  },
    { method: 'GET',    path: '/api/auth/self',           desc: 'Get authenticated user + role',                  auth: true  },
    { method: 'POST',   path: '/api/auth/tenants',        desc: 'Create tenant (ADMIN only)',                     auth: true  },
    { method: 'GET',    path: '/api/auth/tenants',        desc: 'List all tenants',                               auth: true  },
    { method: 'PATCH',  path: '/api/auth/tenants/:id',    desc: 'Update tenant details',                          auth: true  },
    { method: 'DELETE', path: '/api/auth/tenants/:id',    desc: 'Delete tenant (ADMIN only)',                     auth: true  },
    { method: 'POST',   path: '/api/auth/managers',       desc: 'Create manager for a tenant (ADMIN only)',       auth: true  },
    { method: 'GET',    path: '/api/auth/managers',       desc: 'List managers (ADMIN)',                          auth: true  },
    { method: 'PATCH',  path: '/api/auth/managers/:id',   desc: 'Update manager',                                 auth: true  },
  ],
  catalog: [
    { method: 'GET',    path: '/api/catalog/products',            desc: 'List products (?isPublished, ?tenantId)',  auth: false },
    { method: 'POST',   path: '/api/catalog/products',            desc: 'Create product → Kafka PRODUCT_CREATED',   auth: true  },
    { method: 'GET',    path: '/api/catalog/products/:id',        desc: 'Get product by ID',                        auth: false },
    { method: 'PUT',    path: '/api/catalog/products/:id',        desc: 'Update product → Kafka PRODUCT_UPDATED',   auth: true  },
    { method: 'DELETE', path: '/api/catalog/products/:id',        desc: 'Delete product → Kafka PRODUCT_DELETED',   auth: true  },
    { method: 'GET',    path: '/api/catalog/categories',          desc: 'List categories',                          auth: false },
    { method: 'POST',   path: '/api/catalog/categories',          desc: 'Create category',                          auth: true  },
    { method: 'PUT',    path: '/api/catalog/categories/:id',      desc: 'Update category',                          auth: true  },
    { method: 'GET',    path: '/api/catalog/toppings',            desc: 'List toppings (tenant-scoped)',             auth: false },
    { method: 'POST',   path: '/api/catalog/toppings',            desc: 'Create topping → Kafka TOPPING_CREATED',   auth: true  },
    { method: 'PUT',    path: '/api/catalog/toppings/:id',        desc: 'Update topping → Kafka TOPPING_UPDATED',   auth: true  },
    { method: 'DELETE', path: '/api/catalog/toppings/:id',        desc: 'Delete topping → Kafka TOPPING_DELETED',   auth: true  },
    { method: 'GET',    path: '/api/catalog/seed',                desc: 'Seed dummy catalog data (dev)',             auth: true  },
  ],
  order: [
    { method: 'POST',   path: '/api/orders',              desc: 'Place order (validates prices from cache)',        auth: true  },
    { method: 'GET',    path: '/api/orders',              desc: 'List orders (tenant-scoped for manager)',          auth: true  },
    { method: 'GET',    path: '/api/orders/mine',         desc: "Customer's own order history",                    auth: true  },
    { method: 'GET',    path: '/api/orders/:id',          desc: 'Get order detail',                                auth: true  },
    { method: 'PATCH',  path: '/api/orders/:id/status',   desc: 'Update order status (MANAGER/ADMIN)',             auth: true  },
    { method: 'POST',   path: '/api/orders/:id/cancel',   desc: 'Cancel order',                                    auth: true  },
    { method: 'POST',   path: '/api/payments/webhook',    desc: 'Stripe webhook → update paymentStatus=PAID',      auth: false },
  ],
  ws: [
    { method: 'GET',    path: '/socket.io/handshake',     desc: 'WebSocket upgrade (Admin UI ↔ WS Service)',       auth: false },
    { method: 'POST',   path: '/ws/emit/event',           desc: 'Internal: emit Kafka event to tenant room',        auth: true  },
  ],
  notif: [
    { method: 'POST',   path: '/internal/notify/email',   desc: 'Internal: triggered by Kafka consumer',            auth: true  },
  ],
}

export const K8S_TREE = {
  kind: 'Namespace',
  name: 'mern-pizza',
  color: '#4f9eff',
  meta: { cluster: 'AWS EKS', cicd: 'ArgoCD v3.3.2' },
  children: [
    {
      kind: 'Ingress', name: 'auth-service-ingress', color: '#ffb347',
      meta: { host: 'api.mern-pizza-app.cyou', class: 'nginx' },
      annotations: ['proxy-body-size: 10m', 'cors-allow-origin: *', 'use-regex: true'],
    },
    {
      kind: 'Deployment', name: 'auth-service', color: '#4f9eff', replicas: 2,
      meta: { image: 'roshan798/auth-service:sha-xxxx', cpu: '250m', mem: '256Mi' },
      children: [
        { kind: 'Service', name: 'auth-service',  color: '#2ecc71', meta: { type: 'ClusterIP', port: 8001 } },
        { kind: 'Secret',  name: 'auth-secrets',   color: '#e74c3c', keys: ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'] },
      ],
    },
    {
      kind: 'Deployment', name: 'catalog-service', color: '#ff6b2b', replicas: 2,
      meta: { image: 'roshan798/catalog-service:sha-xxxx', cpu: '250m', mem: '256Mi' },
      children: [
        { kind: 'Service', name: 'catalog-service', color: '#2ecc71', meta: { type: 'ClusterIP', port: 8002 } },
        { kind: 'Secret',  name: 'catalog-secrets',  color: '#e74c3c', keys: ['MONGO_URI', 'ADMIN_JWT_SECRET', 'KAFKA_BROKER', 'S3_BUCKET', 'AWS_ACCESS_KEY'] },
      ],
    },
    {
      kind: 'Deployment', name: 'order-service', color: '#ffb347', replicas: 3,
      meta: { image: 'roshan798/order-service:sha-xxxx', cpu: '500m', mem: '512Mi' },
      children: [
        { kind: 'Service', name: 'order-service',  color: '#2ecc71', meta: { type: 'ClusterIP', port: 8003 } },
        { kind: 'Secret',  name: 'order-secrets',   color: '#e74c3c', keys: ['MONGO_URI', 'JWT_SECRET', 'KAFKA_BROKER', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
      ],
    },
    {
      kind: 'Deployment', name: 'websocket-service', color: '#2ecc71', replicas: 2,
      meta: { image: 'roshan798/ws-service:sha-xxxx', cpu: '250m', mem: '256Mi' },
      children: [
        { kind: 'Service', name: 'ws-service',  color: '#2ecc71', meta: { type: 'ClusterIP', port: 8004 } },
        { kind: 'Secret',  name: 'ws-secrets',   color: '#e74c3c', keys: ['KAFKA_BROKER', 'CORS_ORIGIN'] },
      ],
    },
    {
      kind: 'Deployment', name: 'notification-service', color: '#9b59b6', replicas: 1,
      meta: { image: 'roshan798/notif-service:sha-xxxx', cpu: '100m', mem: '128Mi' },
      children: [
        { kind: 'Service', name: 'notif-service',  color: '#2ecc71', meta: { type: 'ClusterIP', port: 8005 } },
        { kind: 'Secret',  name: 'notif-secrets',   color: '#e74c3c', keys: ['KAFKA_BROKER', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] },
      ],
    },
    {
      kind: 'ConfigMap', name: 'app-config', color: '#9b59b6',
      meta: { NODE_ENV: 'production', LOG_LEVEL: 'info' },
    },
  ],
}

export const ERD_TABLES = [
  {
    name: 'Tenant',
    db: 'PostgreSQL',
    color: '#4f9eff',
    fields: [
      { name: 'id',        type: 'UUID', pk: true },
      { name: 'name',      type: 'varchar' },
      { name: 'address',   type: 'varchar' },
      { name: 'createdAt', type: 'timestamp' },
      { name: 'updatedAt', type: 'timestamp' },
    ],
  },
  {
    name: 'User',
    db: 'PostgreSQL',
    color: '#4f9eff',
    fields: [
      { name: 'id',        type: 'UUID', pk: true },
      { name: 'firstName', type: 'varchar' },
      { name: 'lastName',  type: 'varchar' },
      { name: 'email',     type: 'varchar (unique)' },
      { name: 'password',  type: 'varchar (bcrypt)' },
      { name: 'role',      type: 'ADMIN | MANAGER | CUSTOMER' },
      { name: 'tenantId',  type: 'UUID', fk: 'Tenant' },
      { name: 'createdAt', type: 'timestamp' },
    ],
  },
  {
    name: 'Category',
    db: 'MongoDB',
    color: '#ff6b2b',
    fields: [
      { name: '_id',                    type: 'ObjectId', pk: true },
      { name: 'name',                   type: 'string' },
      { name: 'priceConfiguration',     type: 'Map<string, PriceConf>' },
      { name: 'attributeConfiguration', type: 'Map<string, AttrConf>' },
    ],
  },
  {
    name: 'Product',
    db: 'MongoDB',
    color: '#ff6b2b',
    fields: [
      { name: '_id',                type: 'ObjectId', pk: true },
      { name: 'name',               type: 'string' },
      { name: 'description',        type: 'string' },
      { name: 'image',              type: 'string (S3 URL)' },
      { name: 'priceConfiguration', type: 'object' },
      { name: 'attributes',         type: 'object[]' },
      { name: 'tenantId',           type: 'string', fk: 'Tenant(PG)' },
      { name: 'categoryId',         type: 'ObjectId', fk: 'Category' },
      { name: 'isPublished',        type: 'boolean' },
    ],
  },
  {
    name: 'ProductCache',
    db: 'MongoDB (Order Svc)',
    color: '#ffb347',
    fields: [
      { name: '_id',                type: 'ObjectId', pk: true },
      { name: 'productId',          type: 'string' },
      { name: 'name',               type: 'string' },
      { name: 'priceConfiguration', type: 'object (minimal)' },
      { name: 'tenantId',           type: 'string' },
      { name: 'updatedAt',          type: 'Date' },
    ],
  },
  {
    name: 'Order',
    db: 'MongoDB (Order Svc)',
    color: '#ffb347',
    fields: [
      { name: '_id',           type: 'ObjectId', pk: true },
      { name: 'cart',          type: 'CartItem[] (price snapshot)' },
      { name: 'address',       type: 'object' },
      { name: 'customerId',    type: 'UUID', fk: 'User(PG)' },
      { name: 'tenantId',      type: 'string', fk: 'Tenant(PG)' },
      { name: 'comment',       type: 'string' },
      { name: 'status',        type: 'RECEIVED | CONFIRMED | PREPARED | PICKED_UP | ON_ROUTE | DELIVERED' },
      { name: 'paymentMode',   type: 'COD | CARD' },
      { name: 'paymentStatus', type: 'PENDING | PAID | FAILED' },
      { name: 'stripeOrderId', type: 'string (nullable)' },
      { name: 'total',         type: 'number' },
      { name: 'createdAt',     type: 'Date' },
    ],
  },
]

export const ORDER_FLOW = [
  {
    step: 1, title: 'Customer Browses Menu', actor: 'Client UI — mern-pizza-app.cyou', color: '#4f9eff',
    desc: 'GET /api/catalog/products?tenantId=X&isPublished=true — fetches products from Catalog Service.',
  },
  {
    step: 2, title: 'JWT Authentication', actor: 'Auth Service :8001 (PostgreSQL)', color: '#4f9eff',
    desc: 'Customer logs in. Receives JWT access token + HTTP-only refresh token. Role=CUSTOMER, tenantId in claims.',
  },
  {
    step: 3, title: 'Order Submitted', actor: 'Order Service :8003', color: '#ffb347',
    desc: 'POST /api/orders. JWT validated locally via shared secret. Prices confirmed against Kafka-sourced ProductCache.',
  },
  {
    step: 4, title: 'Price Validated from Cache', actor: 'ProductCache (MongoDB, Order Svc)', color: '#ffb347',
    desc: 'All product/topping prices cross-checked against local cache populated from Kafka events. Prevents price tampering.',
  },
  {
    step: 5, title: 'Stripe Payment (CARD mode)', actor: 'Order Service → Stripe API', color: '#6772e5',
    desc: 'If paymentMode=CARD: Order Service calls Stripe to create PaymentIntent, returns checkout URL. Status = PENDING.',
  },
  {
    step: 6, title: 'Stripe Webhook Confirmed', actor: 'POST /api/payments/webhook', color: '#6772e5',
    desc: 'Stripe fires payment.succeeded. Order Service verifies signature, sets paymentStatus=PAID. Publishes ORDER_PLACED.',
  },
  {
    step: 7, title: 'Kafka: ORDER_PLACED Published', actor: 'Kafka Broker', color: '#e74c3c',
    desc: 'ORDER_PLACED event published. WS Service and Notification Service consume independently.',
  },
  {
    step: 8, title: 'Admin Dashboard Notified', actor: 'WS Service :8004 → Admin Dashboard', color: '#2ecc71',
    desc: 'WS Service emits socket event to Admin Dashboard for that tenantId room. Manager sees new order instantly.',
  },
  {
    step: 9, title: 'Confirmation Email Sent', actor: 'Notification Service :8005 → SMTP', color: '#9b59b6',
    desc: 'Notification Service consumes ORDER_PLACED. Sends HTML order confirmation email to customer via Nodemailer.',
  },
  {
    step: 10, title: 'Manager Updates Status', actor: 'Admin Dashboard → Order Service', color: '#ffb347',
    desc: 'PATCH /api/orders/:id/status. Status: CONFIRMED → PREPARED → PICKED_UP → ON_ROUTE. Each triggers Kafka event.',
  },
  {
    step: 11, title: 'Real-time Status to Customer', actor: 'WS Service → Client UI', color: '#2ecc71',
    desc: 'WS Service pushes ORDER_STATUS_CHANGED to customer\'s socket room. Order tracker UI updates live.',
  },
  {
    step: 12, title: 'Order Delivered', actor: 'Client UI — Complete', color: '#4f9eff',
    desc: 'Manager sets DELIVERED. Final WS push. Notification email sent. Customer sees completion.',
  },
]

export const REPOS = [
  { name: 'pizza-app-deployment',             type: 'Infra',    files: 'k8s/*.yaml, ArgoCD apps',             lastCommit: 'increased pod & added revisionHistoryLimit' },
  { name: 'pizza-delivery-app-auth-service',  type: 'Backend',  files: 'routes/, models/, migrations/',       lastCommit: 'add auth deployment' },
  { name: 'pizza-delivery-catalog-service',   type: 'Backend',  files: 'models/, routes/, kafka/producer.ts', lastCommit: 'Kafka events on product mutations' },
  { name: 'pizza-delivery-order-service',     type: 'Backend',  files: 'models/, kafka/, payment/stripe.ts',  lastCommit: 'Stripe webhook handler' },
  { name: 'pizza-delivery-websocket-service', type: 'Backend',  files: 'socket/, kafka/consumer.ts',          lastCommit: 'Socket.io room per tenantId' },
  { name: 'pizza-app-notification-service',   type: 'Backend',  files: 'kafka/consumer.ts, mail/',            lastCommit: 'Order confirmation email template' },
  { name: 'pizza-delivery-client-UI',         type: 'Frontend', files: 'app/, components/OrderTracker',       lastCommit: 'Stripe redirect + real-time tracker' },
  { name: 'pizza-app-admin-dashboard',        type: 'Frontend', files: 'pages/, hooks/useSocket.ts',          lastCommit: 'Real-time order notifications' },
]

export const KAFKA_EVENTS = [
  { topic: 'catalog',  event: 'PRODUCT_CREATED',      producer: 'catalog', consumers: ['order'],        desc: 'New product → Order caches minimal price data' },
  { topic: 'catalog',  event: 'PRODUCT_UPDATED',      producer: 'catalog', consumers: ['order'],        desc: 'Price change → Order cache invalidated + refreshed' },
  { topic: 'catalog',  event: 'PRODUCT_DELETED',      producer: 'catalog', consumers: ['order'],        desc: 'Product removed → Evict from Order cache' },
  { topic: 'catalog',  event: 'TOPPING_CREATED',      producer: 'catalog', consumers: ['order'],        desc: 'New topping → Order caches topping price' },
  { topic: 'catalog',  event: 'TOPPING_UPDATED',      producer: 'catalog', consumers: ['order'],        desc: 'Topping price change → Order cache refresh' },
  { topic: 'catalog',  event: 'TOPPING_DELETED',      producer: 'catalog', consumers: ['order'],        desc: 'Topping removed → Evict from Order cache' },
  { topic: 'orders',   event: 'ORDER_PLACED',         producer: 'order',   consumers: ['ws', 'notif'],  desc: 'Order confirmed → Notify Admin UI + send confirmation email' },
  { topic: 'orders',   event: 'ORDER_STATUS_CHANGED', producer: 'order',   consumers: ['ws', 'notif'],  desc: 'Status update → Real-time push to Customer + email' },
  { topic: 'payments', event: 'PAYMENT_COMPLETED',    producer: 'order',   consumers: ['ws'],           desc: 'Stripe webhook confirmed → Notify Admin in real-time' },
]
