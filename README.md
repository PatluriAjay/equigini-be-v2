# Equigini Backend API

A comprehensive Node.js backend API for managing investment deals, investors, and related data.

## Modules

### Core Modules
- **Investors**: Manage investor profiles with type, geography, and sector preferences
- **Sectors**: Investment sectors categorization
- **Stages**: Investment stages (Seed, Series A, etc.)
- **Status**: Deal and investor status management
- **Ticket Sizes**: Investment ticket size ranges
- **Deals**: Comprehensive deal management with file uploads

### Deals Module Features
- Full CRUD operations for deals
- File upload support for multiple document types
- Advanced filtering and search capabilities
- Priority and visibility management
- Comprehensive documentation available in [DEALS_README.md](DEALS_README.md)

## API Endpoints

### Investors
- `POST /api/createInvestor` - Create new investor
- `POST /api/loginInvestor` - Login investor (returns JWT token)
- `GET /api/getInvestorInfo/:id` - Get investor by ID
- `GET /api/getAllInvestors` - Get all investors
- `PUT /api/updateInvestor/:id` - Update investor
- `DELETE /api/deleteInvestor/:id` - Delete investor
- `GET /api/getInvestorsByType/:type` - Filter by type
- `GET /api/getInvestorsByGeography/:geography` - Filter by geography
- `GET /api/getInvestorsBySector/:sector` - Filter by sector
- `GET /api/getPendingInvestors` - Get pending (unapproved) investors
- `PUT /api/approveInvestor/:id` - Approve investor (admin only)
- `PUT /api/rejectInvestor/:id` - Reject investor (admin only)
- `GET /api/getApprovedInvestors` - Get approved investors only

### Sectors
- `POST /api/createSector` - Create new sector
- `GET /api/getSectorInfo/:id` - Get sector by ID
- `GET /api/getAllSectors` - Get all sectors
- `PUT /api/updateSector/:id` - Update sector
- `DELETE /api/deleteSector/:id` - Delete sector

### Stages
- `POST /api/createStage` - Create new stage
- `GET /api/getStageInfo/:id` - Get stage by ID
- `GET /api/getAllStages` - Get all stages
- `PUT /api/updateStage/:id` - Update stage
- `DELETE /api/deleteStage/:id` - Delete stage

### Status
- `POST /api/createStatus` - Create new status
- `GET /api/getStatusInfo/:id` - Get status by ID
- `GET /api/getAllStatuses` - Get all statuses
- `PUT /api/updateStatus/:id` - Update status
- `DELETE /api/deleteStatus/:id` - Delete status

### Ticket Sizes
- `POST /api/createTicketSize` - Create new ticket size
- `GET /api/getTicketSizeInfo/:id` - Get ticket size by ID
- `GET /api/getAllTicketSizes` - Get all ticket sizes
- `PUT /api/updateTicketSize/:id` - Update ticket size
- `DELETE /api/deleteTicketSize/:id` - Delete ticket size

### Deals
- `POST /api/createDeal` - Create new deal (with file uploads)
- `GET /api/getDealInfo/:id` - Get deal by ID
- `GET /api/getAllDeals` - Get all deals
- `PUT /api/updateDeal/:id` - Update deal (with file uploads)
- `DELETE /api/deleteDeal/:id` - Delete deal
- `GET /api/getDealsBySector/:sectorId` - Filter by sector
- `GET /api/getDealsByStage/:stageId` - Filter by stage
- `GET /api/getDealsByGeography/:geography` - Filter by geography
- `GET /api/getDealsByTicketSize/:ticketSizeId` - Filter by ticket size
- `GET /api/getDealsByStatus/:statusId` - Filter by status
- `GET /api/getDealsByPriority/:priority` - Filter by priority
- `GET /api/getDealsByVisibility/:visibility` - Filter by visibility
- `GET /api/searchDeals?q=term` - Search deals

### NDA Agreements
- `POST /api/signNDA` - Sign or update NDA agreement
- `GET /api/isNDASigned` - Check if NDA is signed for specific deal
- `GET /api/getAllNDAAgreements` - Get all NDA agreements (admin)
- `GET /api/getAllSignedNDAs` - Get only signed NDA agreements (admin)

### WatchList
- `POST /api/toggleDealInWatchlist` - Add/remove deal from investor watchlist
- `GET /api/getInvestorWatchlist/:investor_id` - Get investor's watchlist
- `GET /api/isDealInWatchlist` - Check if deal is in investor's watchlist

### EOI (Expression of Interest)
- `POST /api/createEOI` - Create expression of interest
- `GET /api/getAllEOIs` - Get all expressions of interest
- `GET /api/getEOIsByInvestor/:investor_id` - Get all EOIs submitted by specific investor

## Authentication

### Investor Registration
When creating a new investor, a password field is required. The password is automatically hashed using bcrypt before storing in the database.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "+1234567890",
  "password": "securepassword123",
  "pan_number": "ABCDE1234F",
  "investor_type": "Angel Investor",
  "geography": "North America",
  "investment_range": "$100K - $500K",
  "preferred_sectors": ["Technology", "Healthcare"],
  "source_of_discovery": "Referral",
  "created_by": 1
}
```

### Investor Login
Investors can login using their email and password. The system checks if the account is active before allowing login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "result_code": 200,
  "status": "S",
  "result_info": {
    "investor": {
      "_id": "investor_id",
      "full_name": "John Doe",
      "email": "john@example.com",
      "mobile_number": "+1234567890",
      "pan_number": "ABCDE1234F",
      "investor_type": "Angel Investor",
      "geography": "North America",
      "investment_range": "$100K - $500K",
      "preferred_sectors": ["Technology", "Healthcare"],
      "source_of_discovery": "Referral",
      "is_approved": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** The JWT token should be included in the Authorization header for protected routes:
```
Authorization: Bearer <token>
```

## Installation