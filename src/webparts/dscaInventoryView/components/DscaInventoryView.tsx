import * as React from 'react';
import { useState } from 'react';
import styles from './DscaInventoryView.module.scss';
import type { IDscaInventoryViewProps } from './IDscaInventoryViewProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import type { IAsset, IInventory } from '../types/IInventory';
//import { inventoryData } from '../data/mockInventoryData';
import InventoryEditForm from './InventoryEditForm';
import TimelineEditForm from './TimelineEditForm';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';



const DscaInventoryView: React.FC<IDscaInventoryViewProps> = (props) => {
  // Convert class state to useState hooks
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isTimelineEditMode, setIsTimelineEditMode] = useState<boolean>(false);
  const [selectedTimelineItemId, setSelectedTimelineItemId] = useState<string | undefined>(undefined);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);

  const [inventoryData, setInventory] = React.useState<IInventory>({} as IInventory);

  const isMockData = false;
  //console.log(assets);

  React.useEffect(() => {
    getFSInventory();
  }, []);
  
  const getFSInventory = async () => {
    const response = await props.context.spHttpClient.get(
      `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('FSInventory')/items`,
      SPHttpClient.configurations.v1
    );

    const data = await response.json();
    const assetData: IAsset[] = data.value.map((item: any) => ({
      id: item.Id,
      asset: JSON.parse(item.Asset)
    }));


    const inventoryData: IInventory = {
      assets: assetData,
      lastFullAudit: new Date(),
      organizationUnit: ""
    };
    console.log(inventoryData);
    // Set the inventory data to state
    setInventory(inventoryData)
    
  };

  // Convert class methods to regular functions
  const handleManufacturerFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setManufacturerFilter(event.target.value);
  };

  const getUniqueManufacturers = (assets: IAsset[]): string[] => {
    if (!assets || assets.length === 0) {
      return ['All'];
    }
    const manufacturers = assets.map(asset => asset.asset.manufacturer);
    // Using filter method instead of Array.from(new Set())
    const uniqueManufacturers = manufacturers.filter((value, index, self) => 
      self.indexOf(value) === index
    );
    return ['All', ...uniqueManufacturers];
  };

  const getTypeIcon = (type: 'hardware' | 'software'): JSX.Element => {
    return type === 'hardware' 
      ? <div title="Hardware" className={styles.hardwareIcon}>🖥️</div>
      : <div title="Software" className={styles.softwareIcon}>💿</div>;
  };

  const getStatusClass = (status: string): string => {
    switch(status) {
      case 'active': return styles.statusActive;
      case 'inactive': return styles.statusInactive;
      case 'maintenance': return styles.statusMaintenance;
      case 'retired': return styles.statusRetired;
      case 'disposed': return styles.statusDisposed;
      default: return '';
    }
  };

  const handleAssetClick = (asset: IAsset): void => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setIsAddMode(false);
  };

  // Edit functionality
  const handleEditClick = (): void => {
    setIsEditMode(true);
  };
  
  const handleCancelEdit = (): void => {
    setIsEditMode(false);
    setIsAddMode(false);
  };
  
  const getEndofLifeDate = (timeline: any[]) => {
    let eol = null;
    if (timeline) {
      for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].eventType === 'end-of-life') {
          eol = timeline[i];
          break; // Exit the loop once we find a match
        }
      }
    }
  
    if (eol?.notes) {
      // Convert the EOL date to the required format

      // Parse the date from the notes field
      const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;
      const match = eol.notes.match(dateRegex);
      if (match) {
        const extractedDate = match[0];
        console.log("Extracted Date:", extractedDate);

        const eolDate = new Date(extractedDate);
      
        // Format as YYYY-MM-DDThh:mm:ss
        // Replace padStart with manual string formatting for month and day
        const year = eolDate.getFullYear();
        const monthNum = eolDate.getMonth() + 1;
        const dayNum = eolDate.getDate();

        // Manual zero-padding using conditional logic
        const month = monthNum < 10 ? '0' + monthNum : '' + monthNum;
        const day = dayNum < 10 ? '0' + dayNum : '' + dayNum;

        return `${year}-${month}-${day}T12:00:00`;

      }
      
    }
    
    return null;
  }

  const handleSaveAsset = async (updatedAsset: IAsset): Promise<void> => {
    
          if (!isMockData) {
            const url: string = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('FSInventory')/items`;

            // Use SPHttpClient to post the new item
    
            console.log("updatedAsset.id: " + updatedAsset.id);

            if (updatedAsset.id === '0') { 
              props.context.spHttpClient.post(
                url,
                SPHttpClient.configurations.v1,
                {
                  headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': ''
                  },
                  body: JSON.stringify({
                    Title: updatedAsset.asset.name,
                    Asset: JSON.stringify(updatedAsset.asset),
                    EndofLife: getEndofLifeDate(updatedAsset.asset?.maintenanceTimeline), // Add end-of-life date if exists 
                  }),
                }
              )
              .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                  response.json().then((newItem) => {
                    console.log("New item ID:", newItem.Id);
                    updatedAsset.id = newItem.Id; // Update the asset ID with the new item ID
                    setInventory((prevState) => ({
                      ...prevState,
                      assets: [...prevState.assets, updatedAsset] // Add the new asset to the inventory
                    }));
                    setSelectedAsset(updatedAsset); // Set the selected asset to the newly created one
                    setIsAddMode(false); // Reset add mode
                    setIsEditMode(false);
                    //setIsModalOpen(false); // Close the modal after adding
                  });
                  console.log("List item added successfully!");
                  // You can also process the response further if needed
                } else {
                  console.error(`Error adding list item: ${response.statusText}`);
                }
              })
              .catch((error: Error) => {
                console.error("Error in SPHttpClient post: ", error);
              });
            }
            else {
              const itemEndpoint: string = `${url}(${updatedAsset.id})`;
  
              try {
                // First, we need to get the item's ETag for the IF-MATCH header
                const getItemResponse: SPHttpClientResponse = await props.context.spHttpClient.get(
                  itemEndpoint,
                  SPHttpClient.configurations.v1,
                  {
                    headers: {
                      'Accept': 'application/json;odata=nometadata',
                      'odata-version': ''
                    }
                  }
                );
                
                if (!getItemResponse.ok) {
                  const errorDetails = await getItemResponse.json();
                  console.error('Error retrieving item for update:', errorDetails);
                  throw new Error(`Failed to retrieve item: ${getItemResponse.statusText}`);
                }
                
                const item = await getItemResponse.json();
                const etag = getItemResponse.headers.get('ETag') || '*';
                
                // Now make the PATCH request to update the item
                const updateResponse: SPHttpClientResponse = await props.context.spHttpClient.post(
                  itemEndpoint,
                  SPHttpClient.configurations.v1,
                  {
                    headers: {
                      'Accept': 'application/json;odata=nometadata',
                      'Content-type': 'application/json;odata=nometadata',
                      'odata-version': '',
                      'IF-MATCH': etag,
                      'X-HTTP-Method': 'MERGE'
                    },
                    body: JSON.stringify({
                      Title: updatedAsset.asset.name,
                      Asset: JSON.stringify(updatedAsset.asset),
                      EndofLife: getEndofLifeDate(updatedAsset.asset?.maintenanceTimeline) // Add end-of-life date if exists
                    })
                  }
                );
                
                // Check if the update was successful
                if (updateResponse.ok) {
                  console.log('Item updated successfully:', item.id);
                  // For a MERGE operation, no content is returned
                  //return { success: true, finalAsset };

                  //setInventory((prevState) => ({
                  //  ...prevState,
                  //  assets: [...prevState.assets, updatedAsset] // Add the new asset to the inventory
                  //}));
                  setSelectedAsset(updatedAsset); // Set the selected asset to the newly created one
                  setIsEditMode(false);
                } else {
                  const error = await updateResponse.json();
                  console.error('Error updating FSInventory item:', error);
                  throw new Error(`Failed to update item: ${updateResponse.statusText}`);
                }
              } catch (error) {
                console.error('Exception when updating item in FSInventory list:', error);
                throw error;
              }
            }
          }

    // Find and update the asset in the mock data using a for loop
    //let assetIndex = -1;
    //for (let i = 0; i < inventoryData.assets.length; i++) {
    //  if (inventoryData.assets[i].asset.assetId === updatedAsset.asset.assetId) {
    //    assetIndex = i;
    //    break; // Exit the loop once we find the match
    //  }
    //}
    
    //if (assetIndex !== -1) {
      // Update the asset in the mock data
    //  inventoryData.assets[assetIndex] = updatedAsset;
      
      // Update the selected asset to reflect changes
    //  setSelectedAsset(updatedAsset);
    //  setIsEditMode(false);
    //}
  };

  const handleAddAssetClick = (): void => {
    setSelectedAsset(null); // No asset selected since we're creating a new one
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const handleAddTimelineClick = (): void => {
    setIsTimelineEditMode(true);
    setSelectedTimelineItemId(undefined);
  };

  const handleTimelineItemClick = (event: React.MouseEvent, timelineItemId: string): void => {
    event.stopPropagation(); // Prevent triggering parent click handlers
    setIsTimelineEditMode(true);
    setSelectedTimelineItemId(timelineItemId);
  };

  //const handleSaveTimeline = (updatedAsset: IAsset): void => {
    // Find and update the asset in the mock data using a for loop
  //  let assetIndex = -1;
  //  for (let i = 0; i < inventoryData.assets.length; i++) {
  //    if (inventoryData.assets[i].asset.assetId === updatedAsset.asset.assetId) {
  //      assetIndex = i;
  //      break;
  //    }
  //  }
    
  //  if (assetIndex !== -1) {
      // Update the asset in the mock data
  //    inventoryData.assets[assetIndex] = updatedAsset;
      
      // Update the selected asset to reflect changes
  //    setSelectedAsset(updatedAsset);
  //    setIsTimelineEditMode(false);
  //    setSelectedTimelineItemId(undefined);
  //  }
  //};

  const handleCloseTimelineEdit = (): void => {
    setIsTimelineEditMode(false);
  };
  
  const getTimelineIcon = (eventType: string): JSX.Element => {
    switch(eventType) {
      case 'purchase':
        return <div title="Purchase" className={styles.iconPurchase}>💰</div>;
      case 'deployment':
        return <div title="Deployment" className={styles.iconDeployment}>🚀</div>;
      case 'maintenance':
        return <div title="Maintenance" className={styles.iconMaintenance}>🔧</div>;
      case 'upgrade':
        return <div title="Upgrade" className={styles.iconUpgrade}>⬆️</div>;
      case 'renewal':
        return <div title="Renewal" className={styles.iconRenewal}>🔄</div>;
      case 'end-of-life':
        return <div title="End of Life" className={styles.iconEndOfLife}>⚰️</div>;
      case 'disposal':
        return <div title="Disposal" className={styles.iconDisposal}>🗑️</div>;
      default:
        return <div title="Other" className={styles.iconOther}>📌</div>;
    }
  };

  // Filter assets by manufacturer if a specific one is selected
  const filteredAssets = manufacturerFilter === 'All' 
    ? inventoryData.assets ?? [] 
    : (inventoryData.assets ?? []).filter(asset => asset.asset.manufacturer === manufacturerFilter);

  return (
    <div className={styles.dscaInventoryView}>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <div className={styles.filterSection}>
            <label htmlFor="manufacturerFilter">Filter by Manufacturer: </label>
            <select 
              id="manufacturerFilter"
              value={manufacturerFilter}
              onChange={handleManufacturerFilterChange}
              className={styles.manufacturerFilter}
            >
              {getUniqueManufacturers(inventoryData.assets).map(manufacturer => (
                <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
              ))}
            </select>
          </div>

          <div className={styles.actionSection}>
            <button 
              className={styles.addButton}
              onClick={handleAddAssetClick}
            >
              + Add Asset
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.assetsTable}>
            <thead>
              <tr>
                <th>Type</th>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr 
                  key={asset.asset.assetId} 
                  onClick={() => handleAssetClick(asset)} 
                  className={styles.clickableRow}
                >
                  <td>{getTypeIcon(asset.asset.type)}</td>
                  <td>{asset.asset.assetId}</td>
                  <td>{asset.asset.name}</td>
                  <td className={getStatusClass(asset.asset.status)}>{asset.asset.status}</td>
                  <td>{asset.asset.category}</td>
                  <td>{asset.asset.manufacturer}</td>
                  <td>{asset.asset.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Asset Detail Modal */}
        {isModalOpen && (isAddMode || selectedAsset) && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
              {isEditMode ? (
                // Edit Form
                <InventoryEditForm 
                  id={selectedAsset?.id || ''}
                  onSave={handleSaveAsset}
                  onCancel={handleCancelEdit}
                  inventoryData={inventoryData}
                />
              ) : isAddMode ? (
                // Add Form - no assetId means creating a new asset
                <InventoryEditForm 
                  onSave={handleSaveAsset}
                  onCancel={handleCancelEdit}
                  inventoryData={inventoryData}
                />
              ) : isTimelineEditMode ? (
                // Timeline Edit Form
                <TimelineEditForm
                  assetId={selectedAsset?.asset.assetId || ''}
                  timelineItemId={selectedTimelineItemId}
                  onSave={handleSaveAsset}
                  onClose={handleCloseTimelineEdit}
                  inventoryData={inventoryData}
                />
              ) : (
                // Detail View - only show if we have a selected asset
                <>
                  <div className={styles.modalHeader}>
                    <h2>{selectedAsset?.asset.name || 'Unnamed Asset'}</h2>
                    <div className={styles.modalHeaderButtons}>
                      <button 
                        className={styles.editButton} 
                        onClick={handleEditClick}
                        title="Edit Asset"
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.closeButton} 
                        onClick={closeModal}
                        title="Close"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className={styles.modalContent}>
                    {/* Asset General Information */}
                    <div className={styles.assetSection}>
                      <div className={styles.assetSectionHeader}>
                        <div className={styles.assetTypeIcon}>
                          {selectedAsset && getTypeIcon(selectedAsset.asset.type)}
                        </div>
                        <h3>General Information</h3>
                      </div>
                      <div className={styles.assetInfoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>ID</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.assetId}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Category</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.category}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Manufacturer</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.manufacturer}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Model</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.model}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Status</span>
                          <span className={`${styles.infoValue} ${selectedAsset ? getStatusClass(selectedAsset.asset.status) : ''}`}>
                            {selectedAsset?.asset.status}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Purchase Date</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.purchaseDate ? new Date(selectedAsset.asset.purchaseDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Cost</span>
                          <span className={styles.infoValue}>${selectedAsset?.asset.purchaseCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Department</span>
                          <span className={styles.infoValue}>{selectedAsset?.asset.departmentOwner}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Type Specific Information */}
                    {selectedAsset && selectedAsset.asset.type === 'hardware' && (
                      <div className={styles.assetSection}>
                        <div className={styles.assetSectionHeader}>
                          <h3>Hardware Details</h3>
                        </div>
                        <div className={styles.assetInfoGrid}>
                          {selectedAsset.asset.serialNumber && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Serial Number</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.serialNumber}</span>
                            </div>
                          )}
                          {selectedAsset.asset.macAddress && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>MAC Address</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.macAddress}</span>
                            </div>
                          )}
                          {selectedAsset.asset.ipAddress && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>IP Address</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.ipAddress}</span>
                            </div>
                          )}
                          {selectedAsset.asset.warrantyExpirationDate && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Warranty Until</span>
                              <span className={styles.infoValue}>
                                {selectedAsset.asset.warrantyExpirationDate ? new Date(selectedAsset.asset.warrantyExpirationDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          )}
                          {selectedAsset.asset.specifications && (
                            <>
                              {selectedAsset.asset.specifications.cpu && (
                                <div className={styles.infoItem}>
                                  <span className={styles.infoLabel}>CPU</span>
                                  <span className={styles.infoValue}>{selectedAsset?.asset.specifications.cpu}</span>
                                </div>
                              )}
                              {selectedAsset.asset.specifications.ram && (
                                <div className={styles.infoItem}>
                                  <span className={styles.infoLabel}>RAM</span>
                                  <span className={styles.infoValue}>{selectedAsset?.asset.specifications.ram}</span>
                                </div>
                              )}
                              {selectedAsset.asset.specifications.storage && (
                                <div className={styles.infoItem}>
                                  <span className={styles.infoLabel}>Storage</span>
                                  <span className={styles.infoValue}>{selectedAsset?.asset.specifications.storage}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedAsset && selectedAsset.asset.type === 'software' && (
                      <div className={styles.assetSection}>
                        <div className={styles.assetSectionHeader}>
                          <h3>Software Details</h3>
                        </div>
                        <div className={styles.assetInfoGrid}>
                          {selectedAsset.asset.licenseType && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>License Type</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.licenseType}</span>
                            </div>
                          )}
                          {selectedAsset.asset.version && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Version</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.version}</span>
                            </div>
                          )}
                          {selectedAsset.asset.totalLicenses && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Total Licenses</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.totalLicenses}</span>
                            </div>
                          )}
                          {selectedAsset.asset.usedLicenses && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Used Licenses</span>
                              <span className={styles.infoValue}>{selectedAsset?.asset.usedLicenses}</span>
                            </div>
                          )}
                          {selectedAsset.asset.supportExpirationDate && (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Support Expires</span>
                              <span className={styles.infoValue}>
                                {selectedAsset.asset.supportExpirationDate ? new Date(selectedAsset.asset.supportExpirationDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Maintenance Timeline */}
                    <div className={styles.assetSection}>
                      <div className={styles.assetSectionHeader}>
                        <h3>Maintenance Timeline</h3>
                        <button 
                          className={styles.addButton}
                          onClick={handleAddTimelineClick}
                          title="Add Timeline Event"
                        >
                          + Add Event
                        </button>
                      </div>
                      <div className={styles.timelineContainer}>
                        {selectedAsset?.asset.maintenanceTimeline.map((event) => (
                          <div 
                            key={event.id} 
                            className={styles.timelineEvent}
                            onClick={(e) => handleTimelineItemClick(e, event.id)}
                          >
                            <div className={styles.timelineIconContainer}>
                              {getTimelineIcon(event.eventType)}
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineHeader}>
                                <div className={styles.timelineDate}>
                                  {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className={`${styles.timelineEventType} ${styles[`eventType${event.eventType}`]}`}>
                                  {event.eventType}
                                </div>
                              </div>
                              <div className={styles.timelineDescription}>{event.description}</div>
                              <div className={styles.timelineDetails}>
                                <span>Performed by: {event.performedBy}</span>
                                {event.cost !== undefined && (
                                  <span className={styles.timelineCost}>
                                    Cost: ${event.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </span>
                                )}
                              </div>
                              {event.notes && (
                                <div className={styles.timelineNotes}>
                                  <span className={styles.notesLabel}>Notes:</span> {event.notes}
                                </div>
                              )}
                              {event.attachments && event.attachments.length > 0 && (
                                <div className={styles.timelineAttachments}>
                                  <span className={styles.attachmentsLabel}>Attachments:</span>
                                  <div className={styles.attachmentLinks}>
                                    {event.attachments.map((attachment, i) => (
                                      <a key={i} href={attachment} className={styles.attachmentLink}>
                                        Document {i + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DscaInventoryView;