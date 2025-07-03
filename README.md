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
- **Testimonials**: Customer testimonials with user images and messages

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

### Testimonials
- `POST /api/createTestimonial` - Create new testimonial (with image upload)
- `GET /api/getAllTestimonials` - Get all testimonials
- `GET /api/getTestimonialById/:id` - Get testimonial by ID
- `PUT /api/updateTestimonial/:id` - Update testimonial (with image upload)
- `DELETE /api/deleteTestimonial/:id` - Delete testimonial (soft delete)

### Public Home
- `GET /api/getPublicHomeData` - Get public home data (latest 4 blogs + latest 3 deals + all testimonials)

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

## Testimonial Data Structure

### Create/Update Testimonial
**Request Body (multipart/form-data):**
```json
{
  "user_img": "file", // Image file (JPEG, PNG, GIF, WebP) - max 5MB
  "user_name": "John Doe",
  "investor_type": "Angel Investor",
  "message": "This platform has been incredible for finding great investment opportunities..."
}
```

**Response:**
```json
{
  "result_code": 200,
  "status": "S",
  "result_info": {
    "_id": "testimonial_id",
    "user_img": "files\\testimonials\\testimonial-image-1234567890.jpg",
    "user_name": "John Doe",
    "investor_type": "Angel Investor",
    "message": "This platform has been incredible for finding great investment opportunities...",
    "is_active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Public Home Data Structure

### Get Public Home Data
**Request:** `GET /api/getPublicHomeData`

**Response:**
```json
{
  "result_code": 200,
  "status": "S",
  "result_info": {
    "latest_blogs": [
      {
        "_id": "blog_id_1",
        "title": "Latest Blog Title",
        "slug": "latest-blog-title",
        "excerpt": "This is a brief excerpt of the blog content...",
        "featured_image": {
          "filename": "blog-image-1234567890.jpg",
          "path": "files\\blogs\\images\\blog-image-1234567890.jpg"
        },
        "read_time": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "latest_deals": [
      {
        "_id": "deal_id_1",
        "deal_title": "Latest Deal Title",
        "slug": "latest-deal-title",
        "sector": "Technology",
        "stage": "Series A",
        "geography": "North America",
        "ticket_size_range": "$1M - $5M",
        "expected_irr": "25-35%",
        "timeline": "6-12 months",
        "summary": "Brief summary of the deal...",
        "image": {
          "filename": "deal-image-1234567890.jpg",
          "path": "files\\deals\\images\\deal-image-1234567890.jpg"
        },
        "deal_icon": {
          "filename": "deal-icon-1234567890.jpg",
          "path": "files\\deals\\icons\\deal-icon-1234567890.jpg"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "testimonials": [
      {
        "_id": "testimonial_id_1",
        "user_img": "files\\testimonials\\testimonial-image-1234567890.jpg",
        "user_name": "John Doe",
        "investor_type": "Angel Investor",
        "message": "This platform has been incredible...",
        "is_active": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Installation