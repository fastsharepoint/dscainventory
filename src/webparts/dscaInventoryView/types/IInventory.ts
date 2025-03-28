//inventory and asset management interfaces
// Asset-related interfaces
export interface IAssetTimeline {
  id: string;
  eventType: 'purchase' | 'deployment' | 'maintenance' | 'upgrade' | 'renewal' | 'end-of-life' | 'disposal' | 'other';
  date: string;
  performedBy: string;
  description: string;
  cost?: number;
  attachments?: string[]; // URLs or references to documentation
  notes?: string;
}

export interface IAsset {
  // Common fields
  id: string;
  asset: {
    assetId: string;
    name: string;
    type: 'hardware' | 'software';
    category: string; // e.g., "Server", "Desktop", "Mobile", "Operating System", "Application"
    manufacturer: string;
    model: string;
    status: 'active' | 'inactive' | 'maintenance' | 'retired' | 'disposed';
    purchaseDate: string;
    purchaseCost: number;
    poNumber?: string;
    departmentOwner: string;
    assignedTo?: string;
    location?: string;
    tags?: string[];
    
    // Hardware specific
    serialNumber?: string;
    macAddress?: string;
    ipAddress?: string;
    specifications?: {
      cpu?: string;
      ram?: string;
      storage?: string;
      other?: string;
    };
    warrantyExpirationDate?: string;
    
    // Software specific
    licenseType?: 'perpetual' | 'subscription' | 'open source' | 'trial';
    licenseKey?: string;
    totalLicenses?: number;
    usedLicenses?: number;
    installedOn?: string[]; // References to hardware assets
    version?: string;
    supportExpirationDate?: string;
    
    // Maintenance timeline
    maintenanceTimeline: IAssetTimeline[];
    
    // Additional info
    notes?: string;
    lastUpdated: string;
    updatedBy: string;
  }

}

export interface IInventory {
  assets: IAsset[];
  // Additional inventory metadata could go here
  lastFullAudit?: Date;
  organizationUnit?: string;
}