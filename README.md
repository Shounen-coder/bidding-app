# Biddex- Online Bidding Platform

## Project Structure
bidding-app/
├── frontend/ # React.js frontend
├── backend/ # Node.js API server
├── database/ # PostgreSQL scripts
└── README.md # This file

text

## Technology Stack
- **Frontend**: React.js, Material-UI, Redux Toolkit
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: PostgreSQL
- **Authentication**: JWT

## Setup Instructions

### Database Setup
1. Install PostgreSQL and pgAdmin
2. Create database named 'bidding_app'
3. Run scripts in this order:
   - `database/schema.sql`
   - `database/indexes.sql` 
   - `database/seed.sql`

### Environment Setup
1. Copy `.env.example` to `.env`
2. Update database credentials in `.env`

## Development Timeline
- **Day 1**: ✅ Foundation Setup (COMPLETED)
- **Day 2**: Frontend Foundation
- **Day 3**: User Interface Development
- **Day 4**: Auction Display System
- **Day 5**: Backend API Development
- **Day 6**: Real-Time Bidding Logic
- **Day 7**: Frontend-Backend Integration
- **Day 8**: Polish & Optimization

## Current Status
- Database: ✅ Created with 7 tables
- Sample Data: ✅ 10 categories and test users added
- Project Structure: ✅ Folders and environment files ready
- Next: Day 2 - React frontend setup
