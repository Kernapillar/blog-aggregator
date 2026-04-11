# blog-aggregator
## Requirements

To run gator, you need:

- Typescript installed
- PostgreSQL installed and running
- A Postgres database created for gator

## Setup

1. Clone the repository
2. Create a PostgreSQL database
3. Create a config file for gator
4. Build and run the CLI

## Config

Create a config file in your home directory with your database connection details.
the file should be named '.gatorconfig.json'

and should have the following keys: 
{
  "db_url": "postgres://...",
  "current_user_name": "yourname"
}

## Running

You can run commands like:
(starting with "npm run start")
- `register <name>`
- `login <name>`
- `addfeed <name> <url>`
- `follow <url>`
- `agg <time between requests>`
- `browse`