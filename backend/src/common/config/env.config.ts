export const validateEnv = (config: Record<string, any>) => {
  const required = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter((key) => !config[key] && !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`[Config Error] Missing mandatory production environment variables: ${missing.join(', ')}`);
  }

  return config;
};

export const envConfig = () => {
  const config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/anveshakhub',
    directUrl: process.env.DIRECT_URL,
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qehkqwwotuqyqozuyaji.supabase.co',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_1tVghl8k0qXobIVmZdKrLg_0y85_1bQ',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.JWT_SECRET || 'anveshakhub-super-secret-jwt-key-2026',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    opensearchNode: process.env.OPENSEARCH_NODE || 'http://localhost:9200',
    emailHost: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
    emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
    emailUser: process.env.EMAIL_USER || 'apikey',
    emailPassword: process.env.EMAIL_PASSWORD || 'secret',
  };

  return validateEnv(config);
};
