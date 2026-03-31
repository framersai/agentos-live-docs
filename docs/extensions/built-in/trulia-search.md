---
sidebar_position: 29
---

# Trulia Property Search

Search real estate properties on Trulia by location, price, bedrooms, and property type.

## Overview

Domain-specific real estate search tool. Uses the RapidAPI Trulia endpoint for structured data, with Firecrawl scrape as a fallback when no RapidAPI key is available.

**Package:** `@framers/agentos-ext-trulia-search`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TRULIA_RAPIDAPI_KEY` | No | RapidAPI key for structured data |
| `FIRECRAWL_API_KEY` | No | Firecrawl key for scrape fallback |

At least one is needed for results.

## Tool Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `location` | string | Yes | City/state or zip code |
| `propertyType` | string | No | house, apartment, condo, townhouse, land |
| `minPrice` | number | No | Minimum price |
| `maxPrice` | number | No | Maximum price |
| `bedrooms` | number | No | Minimum bedrooms |
| `bathrooms` | number | No | Minimum bathrooms |
| `maxResults` | number | No | Max results (default: 20) |

## Example

```
User: "Find 3-bedroom houses in Austin, TX under $400k"
Agent: trulia_search({
  location: "Austin, TX",
  propertyType: "house",
  bedrooms: 3,
  maxPrice: 400000
})
Result: [
  { address: "123 Main St", price: 350000, beds: 3, baths: 2, sqft: 1500 },
  { address: "456 Oak Ave", price: 390000, beds: 3, baths: 2.5, sqft: 1800 }
]
```
