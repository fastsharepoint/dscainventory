import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { IAsset, IAssetTimeline } from '../types/IInventory';
//import { mockInventoryData } from '../data/mockInventoryData';
import styles from './TimelineEditForm.module.scss';

interface ITimelineEditFormProps {
  assetId: string;
  timelineItemId?: string; // Optional - if provided, we're editing an existing item
  onSave: (asset: IAsset) => void;
  onClose: () => void;
  inventoryData: { assets: IAsset[] }; // Pass mock data as prop for testing
}

const TimelineEditForm: React.FC<ITimelineEditFormProps> = ({ assetId, timelineItemId, onSave, onClose, inventoryData }) => {
  const [asset, setAsset] = useState<IAsset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [timelineItem, setTimelineItem] = useState<Partial<IAssetTimeline>>({
    eventType: 'maintenance',
    date: new Date().toLocaleDateString(),
    performedBy: '',
    description: '',
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState<string>('');

  const [products, setProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);
  const [isVersionsLoading, setIsVersionsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  
  // Load asset data
  useEffect(() => {
    if (assetId) {
        let foundAsset = null;
        for (let i = 0; i < inventoryData.assets.length; i++) {
          if (inventoryData.assets[i].asset.assetId === assetId) {
            foundAsset = inventoryData.assets[i];
            break; // Exit the loop once we find a match
          }
        }
      if (foundAsset) {
        setAsset(foundAsset);
      } else {
        setError('Asset not found');
      }
      setIsLoading(false);
    }
  }, [assetId]);

  // Load timeline item if editing
  useEffect(() => {
    if (asset && timelineItemId) {
        let foundItem = null;
        for (let i = 0; i < asset.asset.maintenanceTimeline.length; i++) {
          if (asset.asset.maintenanceTimeline[i].id === timelineItemId) {
            foundItem = asset.asset.maintenanceTimeline[i];
            break; // Exit the loop once we find the matching item
          }
        }
      if (foundItem) {
        setTimelineItem(foundItem);
        if (foundItem.attachments) {
          setAttachments(foundItem.attachments);
        }
      } else {
        setError('Timeline item not found');
      }
    }
  }, [asset, timelineItemId]);

  useEffect(() => {
    if (timelineItem.eventType === 'end-of-life') {
      fetchProducts();
    }
  }, [timelineItem.eventType]);

  useEffect(() => {
    if (selectedProduct) {
      fetchVersions(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsProductsLoading(true);
      setApiError('');
      const response = await fetch('https://endoflife.date/api/all.json');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      
      // If editing and we have a product already in notes
      if (timelineItemId && timelineItem.notes) {
        const match = timelineItem.notes.match(/Product: ([\w\d.-]+)/);
        if (match && match[1]) {
          setSelectedProduct(match[1]);
        }
      }
    } catch (error) {
      setApiError('Error fetching products: ' + (error instanceof Error ? error.message : String(error)));
      console.error('Error fetching products:', error);
    } finally {
      setIsProductsLoading(false);
    }
  }, [timelineItemId, timelineItem.notes]);

  const fetchVersions = useCallback(async (product: string) => {
    try {
      setIsVersionsLoading(true);
      setApiError('');
      const response = await fetch(`https://endoflife.date/api/${product}.json`);
      if (!response.ok) throw new Error(`Failed to fetch versions for ${product}`);
      const data = await response.json();
      setVersions(data);
      
      // If editing and we have a version already in notes
      if (timelineItemId && timelineItem.notes) {
        const match = timelineItem.notes.match(/Version: ([\w\d.-]+)/);
        if (match && match[1]) {
          setSelectedVersion(match[1]);
        }
      }
    } catch (error) {
      setApiError('Error fetching versions: ' + (error instanceof Error ? error.message : String(error)));
      console.error('Error fetching versions:', error);
    } finally {
      setIsVersionsLoading(false);
    }
  }, [timelineItemId, timelineItem.notes]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
    setSelectedVersion(''); // Reset version when product changes
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(e.target.value);
    
    // Find the selected version data
    let versionData = null;
    for (let i = 0; i < versions.length; i++) {
      if (versions[i].cycle === e.target.value) {
        versionData = versions[i];
        break; // Exit the loop once we find a match
      }
    }
       
    // Update the notes field with EOL information
    if (versionData) {
      const eolDate = new Date(versionData.eol);
      const formattedDate = eolDate.toLocaleDateString();
      
      const updatedNotes = `Product: ${selectedProduct}\nVersion: ${e.target.value}\nEOL Date: ${formattedDate}\n\n${timelineItem.notes || ''}`;
      
      setTimelineItem(prev => ({
        ...prev,
        notes: updatedNotes
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTimelineItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTimelineItem(prev => ({
      ...prev,
      date: new Date(value).toLocaleDateString()
    }));
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setTimelineItem(prev => ({
      ...prev,
      cost: value
    }));
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setAttachments(prev => [...prev, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset) {
      setError('Asset data not available');
      return;
    }

    if (!timelineItem.description || !timelineItem.performedBy) {
      setError('Please fill out all required fields');
      return;
    }

    // Create a copy of the asset to modify
    const updatedAsset = { ...asset };
    
    // Finalize the timeline item with ID and attachments
    const nextNumber = asset.asset.maintenanceTimeline.length + 1;
    let paddedNumber;
    if (nextNumber < 10) {
      paddedNumber = `00${nextNumber}`;
    } else if (nextNumber < 100) {
      paddedNumber = `0${nextNumber}`;
    } else {
      paddedNumber = nextNumber.toString();
    }
    const finalizedItem: IAssetTimeline = {
      ...(timelineItem as Pick<IAssetTimeline, 'eventType' | 'date' | 'performedBy' | 'description'>),
      id: timelineItemId || `MT-${asset.asset.assetId}-${paddedNumber}`,
    };
    
    // Add optional fields if they exist
    if (timelineItem.cost !== undefined) finalizedItem.cost = timelineItem.cost;
    if (timelineItem.notes) finalizedItem.notes = timelineItem.notes;
    if (attachments.length > 0) finalizedItem.attachments = attachments;

    // Either update existing timeline item or add a new one
    if (timelineItemId) {
        let itemIndex = -1;
        for (let i = 0; i < updatedAsset.asset.maintenanceTimeline.length; i++) {
          if (updatedAsset.asset.maintenanceTimeline[i].id === timelineItemId) {
            itemIndex = i;
            break; // Exit the loop once we find the matching item
          }
        }
        if (itemIndex !== -1) {
          updatedAsset.asset.maintenanceTimeline[itemIndex] = finalizedItem; // Update existing item
        } else {
          setError('Timeline item not found for update');
          return;
        }
    } else {
      updatedAsset.asset.maintenanceTimeline.push(finalizedItem);
    }
    
    // Update the asset's lastUpdated field
    updatedAsset.asset.lastUpdated = new Date().toLocaleDateString();
    
    // Pass the updated asset back to parent
    onSave(updatedAsset);
    onClose();
  };

  // Show loading state
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Show error if asset not found
  if (!asset) {
    return <div className={styles.error}>{error || 'Asset not found'}</div>;
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{timelineItemId ? 'Edit Timeline Event' : 'Add Timeline Event'}</h2>
        <h3>Asset: {asset.asset.name} ({asset.asset.assetId})</h3>
        <div className={styles.formActions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button 
            className={styles.saveButton} 
            form="timelineForm"
            type="submit"
          >
            {timelineItemId ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form id="timelineForm" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="eventType">Event Type *</label>
              <select
                id="eventType"
                name="eventType"
                value={timelineItem.eventType || 'maintenance'}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              >
                <option value="purchase">Purchase</option>
                <option value="deployment">Deployment</option>
                <option value="maintenance">Maintenance</option>
                <option value="upgrade">Upgrade</option>
                <option value="renewal">Renewal</option>
                <option value="end-of-life">End of Life</option>
                <option value="disposal">Disposal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={timelineItem.date ? new Date(timelineItem.date).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="performedBy">Performed By *</label>
              <input
                id="performedBy"
                name="performedBy"
                type="text"
                value={timelineItem.performedBy || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
                placeholder="Name or department"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="cost">Cost</label>
              <input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                value={timelineItem.cost !== undefined ? timelineItem.cost : ''}
                onChange={handleCostChange}
                className={styles.formControl}
                placeholder="0.00"
              />
            </div>
            
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="description">Description *</label>
              <input
                id="description"
                name="description"
                type="text"
                value={timelineItem.description || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
                placeholder="Brief description of the event"
              />
            </div>
            
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={timelineItem.notes || ''}
                onChange={handleInputChange}
                className={styles.formControl}
                rows={3}
                placeholder="Additional details about the event"
              />
            </div>
            
            {timelineItem.eventType === 'end-of-life' && (
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <div className={styles.eolContainer}>
                  <h4>End of Life Information</h4>
                  
                  {apiError && <div className={styles.apiError}>{apiError}</div>}
                  
                  <div className={styles.eolGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="eolProduct">Product</label>
                      <div className={styles.selectWrapper}>
                        <select
                          id="eolProduct"
                          value={selectedProduct}
                          onChange={handleProductChange}
                          className={styles.formControl}
                          disabled={isProductsLoading}
                        >
                          <option value="">-- Select Product --</option>
                          {products.map(product => (
                            <option key={product} value={product}>
                              {product}
                            </option>
                          ))}
                        </select>
                        {isProductsLoading && <div className={styles.spinner}></div>}
                      </div>
                    </div>
                    
                    {selectedProduct && (
                      <div className={styles.formGroup}>
                        <label htmlFor="eolVersion">Version</label>
                        <div className={styles.selectWrapper}>
                          <select
                            id="eolVersion"
                            value={selectedVersion}
                            onChange={handleVersionChange}
                            className={styles.formControl}
                            disabled={isVersionsLoading}
                          >
                            <option value="">-- Select Version --</option>
                            {versions.map(version => (
                              <option key={version.cycle} value={version.cycle}>
                                {version.cycle} (EOL: {new Date(version.eol).toLocaleDateString()})
                              </option>
                            ))}
                          </select>
                          {isVersionsLoading && <div className={styles.spinner}></div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Attachments</label>
              
              <div className={styles.attachmentList}>
                {attachments.length > 0 ? (
                  attachments.map((attachment, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      <span>{attachment}</span>
                      <button 
                        type="button" 
                        className={styles.removeButton}
                        onClick={() => handleRemoveAttachment(index)}
                        title="Remove attachment"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyAttachments}>No attachments</div>
                )}
              </div>
              
              <div className={styles.attachmentInput}>
                <input
                  type="text"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  className={styles.formControl}
                  placeholder="docs://filename.pdf"
                />
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={handleAddAttachment}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TimelineEditForm;