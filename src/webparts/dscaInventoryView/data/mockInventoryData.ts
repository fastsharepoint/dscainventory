import { IInventory } from "../types/IInventory";

export const inventoryData: IInventory = 
{
  assets: [
    // Hardware assets
    {
      id: "1",
      asset: {
        assetId: "HW-001",
        name: "Dell OptiPlex 7090",
        type: "hardware",
        category: "Desktop",
        manufacturer: "Dell",
        model: "OptiPlex 7090",
        status: "active",
        purchaseDate: "2023-01-15",
        purchaseCost: 1299.99,
        poNumber: "PO-2023-0042",
        departmentOwner: "IT Department",
        assignedTo: "John Smith",
        location: "HQ - 3rd Floor",
        tags: ["desktop", "windows", "dell"],
        serialNumber: "DELLT7090X472921",
        macAddress: "00:1A:2B:3C:4D:5E",
        ipAddress: "192.168.1.101",
        specifications: {
          cpu: "Intel Core i7-11700 (8-core, 16MB, 4.9GHz)",
          ram: "32GB DDR4 3200MHz",
          storage: "512GB SSD + 1TB HDD",
          other: "Intel UHD Graphics 750"
        },
        warrantyExpirationDate: "2026-01-15",
        maintenanceTimeline: [
          {
            id: "MT-HW001-001",
            eventType: "purchase",
            date: "2023-01-15",
            performedBy: "Procurement Team",
            description: "Initial purchase",
            cost: 1299.99
          },
          {
            id: "MT-HW001-002",
            eventType: "deployment",
            date: "2023-01-20",
            performedBy: "IT Support",
            description: "Setup and deployment to end user",
            notes: "Installed standard software package"
          },
          {
            id: "MT-HW001-003",
            eventType: "maintenance",
            date: "2023-06-22",
            performedBy: "IT Support",
            description: "Quarterly maintenance",
            notes: "Updated drivers and performed system cleaning"
          },
          {
            id: "MT-HW001-004",
            eventType: "end-of-life",
            date: "2028-01-15", // 5 years after purchase
            performedBy: "IT Asset Management",
            description: "Scheduled end-of-life based on 5-year lifecycle policy",
            notes: "Will evaluate replacement options 6 months before EOL date"
          }
        ],
        notes: "Primary workstation for design team lead",
        lastUpdated: "2023-06-22",
        updatedBy: "Admin User"
      }
    },
    {
      id: "2",
      asset: {
        assetId: "HW-002",
        name: "Dell PowerEdge R740",
        type: "hardware",
        category: "Server",
        manufacturer: "Dell",
        model: "PowerEdge R740",
        status: "active",
        purchaseDate: "2022-03-10",
        purchaseCost: 8750.00,
        poNumber: "PO-2022-0125",
        departmentOwner: "IT Infrastructure",
        location: "Server Room A",
        tags: ["server", "dell", "critical"],
        serialNumber: "DELL7R740S832715",
        macAddress: "00:2C:3D:4E:5F:6G",
        ipAddress: "192.168.0.5",
        specifications: {
          cpu: "2x Intel Xeon Gold 6248R (24-core, 3.0GHz)",
          ram: "384GB DDR4",
          storage: "8x 1.92TB SSD (RAID 10)",
          other: "Redundant Power Supplies"
        },
        warrantyExpirationDate: "2027-03-10",
        maintenanceTimeline: [
          {
            id: "MT-HW002-001",
            eventType: "purchase",
            date: "2022-03-10",
            performedBy: "Infrastructure Team",
            description: "Server procurement",
            cost: 8750.00
          },
          {
            id: "MT-HW002-002",
            eventType: "deployment",
            date: "2022-03-18",
            performedBy: "Server Admin Team",
            description: "Server rack installation and initial configuration",
            attachments: ["docs://server-installation-guide.pdf"]
          },
          {
            id: "MT-HW002-003",
            eventType: "maintenance",
            date: "2022-09-15",
            performedBy: "Dell Support",
            description: "Firmware updates",
            cost: 0,
            notes: "Under warranty service"
          },
          {
            id: "MT-HW002-004",
            eventType: "upgrade",
            date: "2023-05-12",
            performedBy: "Infrastructure Team",
            description: "RAM upgrade from 256GB to 384GB",
            cost: 1200.00
          },
          {
            id: "MT-HW002-005",
            eventType: "end-of-life",
            date: "2029-03-10", // 7 years after purchase
            performedBy: "IT Infrastructure Team",
            description: "Planned server retirement per infrastructure roadmap",
            notes: "Data migration planning to begin 12 months before EOL"
          }
        ],
        notes: "Primary database server",
        lastUpdated: "2023-05-12",
        updatedBy: "System Administrator"
      }
    },
    {
      id: "3",
      asset: {
        assetId: "HW-003",
        name: "MacBook Pro 16",
        type: "hardware",
        category: "Laptop",
        manufacturer: "Apple",
        model: "MacBook Pro 16-inch 2023",
        status: "active",
        purchaseDate: "2023-07-05",
        purchaseCost: 2499.00,
        poNumber: "PO-2023-0287",
        departmentOwner: "Design",
        assignedTo: "Sarah Johnson",
        location: "Remote",
        tags: ["laptop", "apple", "design"],
        serialNumber: "C02G42MFMD6T",
        macAddress: "00:3D:4E:5F:6G:7H",
        specifications: {
          cpu: "Apple M2 Pro",
          ram: "32GB unified memory",
          storage: "1TB SSD",
          other: "16-inch Liquid Retina XDR display"
        },
        warrantyExpirationDate: "2024-07-05",
        maintenanceTimeline: [
          {
            id: "MT-HW003-001",
            eventType: "purchase",
            date: "2023-07-05",
            performedBy: "Procurement Team",
            description: "New laptop for design lead",
            cost: 2499.00
          },
          {
            id: "MT-HW003-002",
            eventType: "deployment",
            date: "2023-07-10",
            performedBy: "IT Support",
            description: "Setup with design software suite",
            notes: "Adobe Creative Cloud and related tools installed"
          },
          {
            id: "MT-HW003-003",
            eventType: "end-of-life",
            date: "2027-07-05", // 4 years after purchase
            performedBy: "IT Asset Management",
            description: "End of standard lifecycle for laptops",
            notes: "Eligible for employee purchase program after decommissioning"
          }
        ],
        notes: "Used primarily for graphic design and video editing",
        lastUpdated: "2023-07-10",
        updatedBy: "IT Support"
      }
    },
    {
      id: "4",
      asset: {
        assetId: "HW-004",
        name: "Cisco Catalyst 9300",
        type: "hardware",
        category: "Network",
        manufacturer: "Cisco",
        model: "Catalyst 9300-48T",
        status: "active",
        purchaseDate: "2022-01-18",
        purchaseCost: 9800.00,
        poNumber: "PO-2022-0012",
        departmentOwner: "IT Infrastructure",
        location: "Server Room B",
        tags: ["network", "cisco", "core"],
        serialNumber: "FDO2343R0C1",
        macAddress: "00:4F:5G:6H:7I:8J",
        ipAddress: "192.168.0.2",
        specifications: {
          other: "48-port Gigabit Ethernet switch with 4x 10G uplinks"
        },
        warrantyExpirationDate: "2025-01-18",
        maintenanceTimeline: [
          {
            id: "MT-HW004-001",
            eventType: "purchase",
            date: "2022-01-18",
            performedBy: "Network Team",
            description: "Core switch replacement",
            cost: 9800.00
          },
          {
            id: "MT-HW004-002",
            eventType: "deployment",
            date: "2022-01-25",
            performedBy: "Network Engineer",
            description: "Installation and configuration",
            attachments: ["docs://network-diagram-2022.pdf"]
          },
          {
            id: "MT-HW004-003",
            eventType: "maintenance",
            date: "2022-08-15",
            performedBy: "Network Team",
            description: "IOS upgrade",
            notes: "Updated to version 17.6.1"
          },
          {
            id: "MT-HW004-004",
            eventType: "end-of-life",
            date: "2030-01-18", // 8 years after purchase
            performedBy: "Network Team",
            description: "Network equipment lifecycle expiration",
            notes: "Review network architecture before replacement"
          }
        ],
        notes: "Core distribution switch for east wing",
        lastUpdated: "2022-08-15",
        updatedBy: "Network Admin"
      }
    },
    {
      id: "5",
      asset: {
        assetId: "HW-005",
        name: "iPhone 14 Pro",
        type: "hardware",
        category: "Mobile",
        manufacturer: "Apple",
        model: "iPhone 14 Pro",
        status: "active",
        purchaseDate: "2022-10-10",
        purchaseCost: 999.00,
        poNumber: "PO-2022-0412",
        departmentOwner: "Sales",
        assignedTo: "Michael Chen",
        location: "Mobile",
        tags: ["mobile", "apple", "sales"],
        serialNumber: "DNPGR4KN0P0P",
        macAddress: "00:5G:6H:7I:8J:9K",
        specifications: {
          storage: "256GB",
          other: "A16 Bionic chip, 6.1-inch Super Retina XDR display"
        },
        warrantyExpirationDate: "2023-10-10",
        maintenanceTimeline: [
          {
            id: "MT-HW005-001",
            eventType: "purchase",
            date: "2022-10-10",
            performedBy: "Procurement Team",
            description: "Mobile device for sales director",
            cost: 999.00
          },
          {
            id: "MT-HW005-002",
            eventType: "deployment",
            date: "2022-10-12",
            performedBy: "IT Support",
            description: "Setup with MDM and company apps",
            notes: "Enrolled in Microsoft Intune"
          },
          {
            id: "MT-HW005-003",
            eventType: "maintenance",
            date: "2023-02-15",
            performedBy: "Apple Store",
            description: "Screen replacement",
            cost: 279.00,
            notes: "Accidental damage repair"
          },
          {
            id: "MT-HW005-004",
            eventType: "end-of-life",
            date: "2025-10-10", // 3 years after purchase
            performedBy: "Mobile Device Management",
            description: "Mobile device refresh cycle",
            notes: "Wipe device and return to Apple Trade-in Program"
          }
        ],
        notes: "Executive device with special security requirements",
        lastUpdated: "2023-02-15",
        updatedBy: "IT Support"
      }
    },
    {
      id: "6",
      asset: {
        assetId: "HW-006",
        name: "HP LaserJet Enterprise M607",
        type: "hardware",
        category: "Printer",
        manufacturer: "HP",
        model: "LaserJet Enterprise M607n",
        status: "active",
        purchaseDate: "2021-08-20",
        purchaseCost: 699.99,
        poNumber: "PO-2021-0287",
        departmentOwner: "Operations",
        location: "HQ - 2nd Floor Print Room",
        tags: ["printer", "hp", "shared"],
        serialNumber: "VNC4H76325",
        macAddress: "00:6H:7I:8J:9K:0L",
        ipAddress: "192.168.1.201",
        specifications: {
          other: "55ppm monochrome laser printer with network connectivity"
        },
        warrantyExpirationDate: "2024-08-20",
        maintenanceTimeline: [
          {
            id: "MT-HW006-001",
            eventType: "purchase",
            date: "2021-08-20",
            performedBy: "Procurement Team",
            description: "Department printer procurement",
            cost: 699.99
          },
          {
            id: "MT-HW006-002",
            eventType: "deployment",
            date: "2021-08-25",
            performedBy: "IT Support",
            description: "Printer setup and network configuration"
          },
          {
            id: "MT-HW006-003",
            eventType: "maintenance",
            date: "2022-03-12",
            performedBy: "IT Support",
            description: "Toner replacement",
            cost: 125.00
          },
          {
            id: "MT-HW006-004",
            eventType: "maintenance",
            date: "2022-10-05",
            performedBy: "HP Service",
            description: "Fuser unit replacement",
            cost: 220.00,
            notes: "Printing quality issues resolved"
          },
          {
            id: "MT-HW006-005",
            eventType: "maintenance",
            date: "2023-04-18",
            performedBy: "IT Support",
            description: "Toner replacement",
            cost: 125.00
          },
          {
            id: "MT-HW006-006",
            eventType: "end-of-life",
            date: "2026-08-20", // 5 years after purchase
            performedBy: "Facilities Management",
            description: "Printer replacement due to increasing maintenance costs",
            notes: "Evaluate printing needs before replacement"
          }
        ],
        notes: "High-volume department printer",
        lastUpdated: "2023-04-18",
        updatedBy: "IT Support"
      }
    },
    
    // Software assets
    {
      id: "7",
      asset: {
        assetId: "SW-001",
        name: "Microsoft 365 E3",
        type: "software",
        category: "Productivity Suite",
        manufacturer: "Microsoft",
        model: "Microsoft 365",
        status: "active",
        purchaseDate: "2023-01-01",
        purchaseCost: 36000.00, // Annual cost for 100 licenses
        poNumber: "PO-2023-0001",
        departmentOwner: "IT Department",
        tags: ["microsoft", "subscription", "productivity"],
        licenseType: "subscription",
        totalLicenses: 100,
        usedLicenses: 92,
        version: "E3",
        supportExpirationDate: "2024-01-01",
        maintenanceTimeline: [
          {
            id: "MT-SW001-001",
            eventType: "purchase",
            date: "2023-01-01",
            performedBy: "IT Director",
            description: "Annual Microsoft 365 subscription renewal",
            cost: 36000.00
          },
          {
            id: "MT-SW001-002",
            eventType: "maintenance",
            date: "2023-05-15",
            performedBy: "IT Admin",
            description: "License audit and optimization",
            notes: "Reclaimed 5 unused licenses"
          },
          {
            id: "MT-SW001-003",
            eventType: "end-of-life",
            date: "2024-01-01", // At next renewal
            performedBy: "IT Director",
            description: "License renewal evaluation",
            notes: "Consider Microsoft 365 E5 upgrade options"
          }
        ],
        notes: "Company-wide productivity and collaboration suite",
        lastUpdated: "2023-05-15",
        updatedBy: "IT Admin"
      }
    },
    {
      id: "8",
      asset: {
        assetId: "SW-002",
        name: "Adobe Creative Cloud",
        type: "software",
        category: "Design Suite",
        manufacturer: "Adobe",
        model: "Creative Cloud",
        status: "active",
        purchaseDate: "2022-11-10",
        purchaseCost: 8400.00, // Annual cost for 10 licenses
        poNumber: "PO-2022-0415",
        departmentOwner: "Marketing",
        tags: ["adobe", "design", "subscription"],
        licenseType: "subscription",
        licenseKey: "ADCC-ENT-10-2022-43215",
        totalLicenses: 10,
        usedLicenses: 8,
        installedOn: ["HW-003", "HW-001"],
        version: "2023",
        supportExpirationDate: "2023-11-10",
        maintenanceTimeline: [
          {
            id: "MT-SW002-001",
            eventType: "purchase",
            date: "2022-11-10",
            performedBy: "Marketing Director",
            description: "Annual Creative Cloud subscription",
            cost: 8400.00
          },
          {
            id: "MT-SW002-002",
            eventType: "upgrade",
            date: "2023-05-22",
            performedBy: "IT Support",
            description: "Upgraded to 2023 version",
            notes: "All users updated to latest release"
          },
          {
            id: "MT-SW002-003",
            eventType: "end-of-life",
            date: "2023-11-10", // At next renewal
            performedBy: "Marketing Director",
            description: "Annual subscription review",
            notes: "Evaluate user needs and adjust license count"
          }
        ],
        notes: "Used by design and marketing teams",
        lastUpdated: "2023-05-22",
        updatedBy: "IT Support"
      }
    },
    {
      id: "9",
      asset: {
        assetId: "SW-003",
        name: "VMware vSphere",
        type: "software",
        category: "Virtualization",
        manufacturer: "VMware",
        model: "vSphere",
        status: "active",
        purchaseDate: "2021-06-15",
        purchaseCost: 12500.00,
        poNumber: "PO-2021-0201",
        departmentOwner: "IT Infrastructure",
        tags: ["vmware", "virtualization", "datacenter"],
        licenseType: "perpetual",
        licenseKey: "VS-ENT-4-SOC-xxxxx-xxxxx",
        totalLicenses: 4, // 4 socket licenses
        usedLicenses: 4,
        installedOn: ["HW-002"],
        version: "7.0 U3",
        supportExpirationDate: "2024-06-15",
        maintenanceTimeline: [
          {
            id: "MT-SW003-001",
            eventType: "purchase",
            date: "2021-06-15",
            performedBy: "IT Director",
            description: "Initial purchase with 3 year support",
            cost: 12500.00,
            attachments: ["docs://vsphere-license-agreement.pdf"]
          },
          {
            id: "MT-SW003-002",
            eventType: "upgrade",
            date: "2022-02-10",
            performedBy: "System Administrator",
            description: "Upgrade from 7.0 to 7.0 U2",
            notes: "Scheduled maintenance window"
          },
          {
            id: "MT-SW003-003",
            eventType: "upgrade",
            date: "2022-11-28",
            performedBy: "System Administrator",
            description: "Upgrade from 7.0 U2 to 7.0 U3",
            notes: "Security patches and bug fixes applied"
          },
          {
            id: "MT-SW003-004",
            eventType: "end-of-life",
            date: "2026-06-15", // 5 years after purchase
            performedBy: "IT Infrastructure Team",
            description: "End of support planning",
            cost: 0,
            notes: "Assess cloud migration alternatives"
          }
        ],
        notes: "Core virtualization platform for datacenter",
        lastUpdated: "2022-11-28",
        updatedBy: "System Administrator"
      } 
    },
    {
      id: "10",
      asset: {
        assetId: "SW-004",
        name: "Windows Server 2022",
        type: "software",
        category: "Operating System",
        manufacturer: "Microsoft",
        model: "Windows Server",
        status: "active",
        purchaseDate: "2022-04-05",
        purchaseCost: 4800.00,
        poNumber: "PO-2022-0156",
        departmentOwner: "IT Infrastructure",
        tags: ["microsoft", "server", "os"],
        licenseType: "perpetual",
        licenseKey: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
        totalLicenses: 8,
        usedLicenses: 6,
        installedOn: ["HW-002"],
        version: "2022 Datacenter",
        supportExpirationDate: "2027-04-05",
        maintenanceTimeline: [
          {
            id: "MT-SW004-001",
            eventType: "purchase",
            date: "2022-04-05",
            performedBy: "Procurement Team",
            description: "License purchase for new servers",
            cost: 4800.00
          },
          {
            id: "MT-SW004-002",
            eventType: "deployment",
            date: "2022-04-20",
            performedBy: "System Administrator",
            description: "OS installation on VM hosts",
            notes: "Base image created for future deployments"
          },
          {
            id: "MT-SW004-003",
            eventType: "maintenance",
            date: "2022-10-12",
            performedBy: "System Administrator",
            description: "Security updates and patches",
            notes: "Monthly patch cycle applied"
          },
          {
            id: "MT-SW004-004",
            eventType: "maintenance",
            date: "2023-02-15",
            performedBy: "System Administrator",
            description: "Feature update installation",
            notes: "Applied 22H2 update"
          },
          {
            id: "MT-SW004-005", 
            eventType: "end-of-life",
            date: "2032-04-05", // 10 years after purchase (typical for Windows Server)
            performedBy: "System Administrator",
            description: "OS end-of-support date",
            notes: "Major infrastructure upgrade planned to coincide with EOL"
          }
        ],
        notes: "Standard OS for server infrastructure",
        lastUpdated: "2023-02-15",
        updatedBy: "System Administrator"
      }
      }
  ],
  lastFullAudit: new Date("2023-01-15"),
  organizationUnit: "Corporate Headquarters"
};