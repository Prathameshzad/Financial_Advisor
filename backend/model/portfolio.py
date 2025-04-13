from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

# Define possible sectors
Sector = Literal[
    'Technology', 
    'Healthcare', 
    'Financials', 
    'Consumer Discretionary',
    'Communication Services',
    'Industrials',
    'Consumer Staples',
    'Energy',
    'Utilities',
    'Real Estate',
    'Materials',
    'Other'
]

class PortfolioItemSchema(BaseModel):
    user_id: str = Field(..., description="The user ID who owns this portfolio item")
    symbol: str = Field(..., min_length=1, max_length=10, description="Stock symbol/ticker")
    quantity: float = Field(..., gt=0, description="Number of shares/units")
    purchase_price: float = Field(..., gt=0, description="Price per share at purchase")
    sector: Sector = Field(..., description="Sector the stock belongs to")


class DeletedPortfolioItemSchema(PortfolioItemSchema):
    current_price: Optional[float] = Field(None, description="Price at time of deletion")
    invested_value: Optional[float] = Field(None, description="Total invested amount")
    current_value: Optional[float] = Field(None, description="Current value at deletion")
    pnl: Optional[float] = Field(None, description="Profit/Loss amount")
    pnl_percentage: Optional[float] = Field(None, description="Profit/Loss percentage")