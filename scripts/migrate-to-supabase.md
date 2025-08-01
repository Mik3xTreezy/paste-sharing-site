# Migration Guide: SQLite to Supabase

## Step 1: Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and database password
3. Go to Settings > Database to get your connection string

## Step 2: Update Environment Variables

Replace the DATABASE_URL in your `.env` file:

```env
# Old SQLite URL
# DATABASE_URL="file:./dev.db"

# New Supabase URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Step 3: Generate and Push Schema

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push the schema to Supabase
npx prisma db push

# Optional: Create a migration
npx prisma migrate dev --name init
```

## Step 4: Verify Connection

```bash
# Test the connection
npx prisma studio
```

## Step 5: Deploy

Your app is now ready to use Supabase! The schema will be automatically created when you run `npx prisma db push`.

## Benefits of Supabase

- ✅ **Managed PostgreSQL**: No server management needed
- ✅ **Real-time subscriptions**: Built-in real-time features
- ✅ **Row Level Security**: Advanced security policies
- ✅ **Auto-generated APIs**: REST and GraphQL APIs
- ✅ **Dashboard**: Beautiful admin interface
- ✅ **Backups**: Automatic backups
- ✅ **Scaling**: Handles traffic spikes automatically 