import * as React from 'react';
import { useState, useEffect } from 'react';
import type { IAsset } from '../types/IInventory';
//import { mockInventoryData } from '../data/mockInventoryData';
import styles from './InventoryEditForm.module.scss';

interface IInventoryEditFormProps {
  id?: string;
  onSave: (asset: IAsset) => void;
  onCancel: () => void;
  inventoryData: { assets: IAsset[] }; // Pass mock data as prop for testing
}

const InventoryEditForm: React.FC<IInventoryEditFormProps> = ({ id, onSave, onCancel, inventoryData }) => {
  const [isEditing, setIsEditing] = useState<boolean>(!!id);
  const [asset, setAsset] = useState<IAsset>({
    id: '0', // Default 0 ID for new asset
    asset: {
      assetId: '',
      name: '',
      type: 'hardware', // Default type
      category: '',
      manufacturer: '',
      model: '',
      status: 'active', // Default status
      purchaseDate: new Date().toISOString().split('T')[0], // Default to today
      purchaseCost: 0,
      poNumber: '',
      departmentOwner: '',
      assignedTo: '',
      location: '',
      tags: [],
      maintenanceTimeline: [], // Initialize as empty array
      lastUpdated: new Date().toLocaleDateString(),
      updatedBy: ''
    }
  });
  const [formError, setFormError] = useState<string>('');
  
  useEffect(() => { 
    setIsEditing(!!id); // Update editing state based on assetId prop
  }, []); // Empty effect to avoid warnings 

  // Load existing asset data if editing
  useEffect(() => {
    if (id) {
      const existingAsset = inventoryData.assets.filter(a => a.id === id)[0];
      if (existingAsset) {
        setAsset(existingAsset);
      } else {
        setFormError('Asset not found');
      }
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Check if this is a nested property access (contains a dot)
    if (name.indexOf('.') !== -1) {
      //const [parent, child] = name.split('.');
      setAsset(prev => ({
        ...prev,
        asset: {
          ...prev.asset
      }}));
    } else {
      // Handle direct properties of asset object
      setAsset(prev => ({
        ...prev,
        asset: {
          ...prev.asset,
          [name]: value
        }
      }));
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAsset(prev => ({
      ...prev,
      asset: {
        ...prev.asset,
        [name]: parseFloat(value) || 0
      }
    }));
    return null; // Ensure a fallback return value if no JSX is rendered
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAsset(prev => ({
      ...prev,
      asset: {
        ...prev.asset,
        [name]: new Date(value)
      }
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'hardware' | 'software';
    setAsset(prev => ({
      ...prev,
      asset: {
        ...prev.asset,
        type: newType
      }
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagValues = e.target.value.split(',').map(tag => tag.trim());
    setAsset(prev => ({
      ...prev,
      asset: {
        ...prev.asset,
        tags: tagValues
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting asset:', asset); // Debugging log
    // Simple validation
    if (!asset.asset?.name || !asset.asset?.manufacturer || !asset.asset?.model || !asset.asset?.category) {
      setFormError('Please fill out all required fields');
      return;
    }

    // Make a copy of the asset to avoid modifying state directly
    const finalAsset = { ...asset };

    // Generate new ID if creating
    if (!isEditing) {
      // Generate an ID for the asset itself
      //const newAssetId = `${inventoryData.assets.length + 1}`;
      
      // Generate an assetId (the visible ID like HW-001)
      const prefix = asset.asset.type === 'hardware' ? 'HW-' : 'SW-';
      const lastId = inventoryData.assets
        .filter(a => a.asset.type === asset.asset?.type)
        .map(a => parseInt(a.asset.assetId.split('-')[1]))
        .sort((a, b) => b - a)[0] || 0;
      
      const idNumber = lastId + 1;
      const paddedId = idNumber < 10 ? `00${idNumber}` : 
                       idNumber < 100 ? `0${idNumber}` : 
                       idNumber.toString();
      const newVisibleId = `${prefix}${paddedId}`;
      
      // Set the IDs
      //finalAsset.id = newAssetId;
      if (finalAsset.asset) {
        finalAsset.asset.assetId = newVisibleId;
      }
      
      // Initialize maintenance timeline if not exists
      if (!finalAsset.asset?.maintenanceTimeline) {
        finalAsset.asset.maintenanceTimeline = [];
      }
      
      // Add purchase event to timeline
      finalAsset.asset?.maintenanceTimeline?.push({
        id: `MT-${newVisibleId}-001`,
        eventType: 'purchase',
        date: finalAsset.asset.purchaseDate,
        performedBy: 'Procurement Team',
        description: 'Initial purchase',
        cost: finalAsset.asset.purchaseCost
      });
      

      // Add the new asset to the inventory
      //inventoryData.assets.push(finalAsset as IAsset);
    } else {
      // Update existing asset

      let assetIndex = -1;
      for (let i = 0; i < inventoryData.assets.length; i++) {
        if (inventoryData.assets[i].id === id) {
          assetIndex = i;
          break; // Exit the loop once we find the match
        }
      }
      
      if (assetIndex !== -1) {
        inventoryData.assets[assetIndex] = finalAsset as IAsset;
      }
    }
    
    // Update lastUpdated field
    if (finalAsset.asset) {
      finalAsset.asset.lastUpdated = new Date().toLocaleDateString();
    }
    
    // Pass the asset back to parent
    onSave(finalAsset as IAsset);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{isEditing ? 'Edit Asset' : 'Add New Asset'}</h2>
        <div className={styles.formActions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button 
            className={styles.saveButton} 
            form="assetForm"
            type="submit"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
      
      {formError && <div className={styles.errorMessage}>{formError}</div>}
      
      <form id="assetForm" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h3>Basic Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={asset.asset?.name || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={asset.asset?.type || 'hardware'}
                onChange={handleTypeChange}
                required
                className={styles.formControl}
              >
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <input
                id="category"
                name="category"
                type="text"
                value={asset.asset?.category || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
                placeholder={asset.asset?.type === 'hardware' ? 'Desktop, Server, Network, etc.' : 'OS, Application, Suite, etc.'}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={asset.asset?.status || 'active'}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="manufacturer">Manufacturer *</label>
              <input
                id="manufacturer"
                name="manufacturer"
                type="text"
                value={asset.asset?.manufacturer || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="model">Model *</label>
              <input
                id="model"
                name="model"
                type="text"
                value={asset.asset?.model || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="purchaseDate">Purchase Date *</label>
              <input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={asset.asset?.purchaseDate ? new Date(asset.asset?.purchaseDate).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="purchaseCost">Purchase Cost *</label>
              <input
                id="purchaseCost"
                name="purchaseCost"
                type="number"
                step="0.01"
                value={asset.asset?.purchaseCost || 0}
                onChange={handleNumberChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="poNumber">PO Number</label>
              <input
                id="poNumber"
                name="poNumber"
                type="text"
                value={asset.asset?.poNumber || ''}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="departmentOwner">Department Owner *</label>
              <input
                id="departmentOwner"
                name="departmentOwner"
                type="text"
                value={asset.asset?.departmentOwner || ''}
                onChange={handleInputChange}
                required
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                name="assignedTo"
                type="text"
                value={asset.asset?.assignedTo || ''}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={asset.asset?.location || ''}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={asset.asset?.tags ? asset.asset?.tags.join(', ') : ''}
                onChange={handleTagsChange}
                className={styles.formControl}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </div>
        
        {/* Type-specific fields */}
        {asset.asset?.type === 'hardware' && (
          <div className={styles.formSection}>
            <h3>Hardware Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="serialNumber">Serial Number</label>
                <input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  value={(asset as any).serialNumber || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="macAddress">MAC Address</label>
                <input
                  id="macAddress"
                  name="macAddress"
                  type="text"
                  value={(asset as any).macAddress || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ipAddress">IP Address</label>
                <input
                  id="ipAddress"
                  name="ipAddress"
                  type="text"
                  value={(asset as any).ipAddress || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="warrantyExpirationDate">Warranty Expiration</label>
                <input
                  id="warrantyExpirationDate"
                  name="warrantyExpirationDate"
                  type="date"
                  value={(asset as any).warrantyExpirationDate ? 
                    new Date((asset as any).warrantyExpirationDate).toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label htmlFor="specificationsCpu">CPU</label>
                <input
                  id="specificationsCpu"
                  name="specifications.cpu"
                  type="text"
                  value={(asset as any).specifications?.cpu || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAsset(prev => ({
                      ...prev,
                      specifications: {
                        ...(prev as any).specifications || {},
                        cpu: value
                      }
                    }));
                  }}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="specificationsRam">RAM</label>
                <input
                  id="specificationsRam"
                  name="specifications.ram"
                  type="text"
                  value={(asset as any).specifications?.ram || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAsset(prev => ({
                      ...prev,
                      specifications: {
                        ...(prev as any).specifications || {},
                        ram: value
                      }
                    }));
                  }}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="specificationsStorage">Storage</label>
                <input
                  id="specificationsStorage"
                  name="specifications.storage"
                  type="text"
                  value={(asset as any).specifications?.storage || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAsset(prev => ({
                      ...prev,
                      specifications: {
                        ...(prev as any).specifications || {},
                        storage: value
                      }
                    }));
                  }}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="specificationsOther">Other Specifications</label>
                <input
                  id="specificationsOther"
                  name="specifications.other"
                  type="text"
                  value={(asset as any).specifications?.other || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAsset(prev => ({
                      ...prev,
                      specifications: {
                        ...(prev as any).specifications || {},
                        other: value
                      }
                    }));
                  }}
                  className={styles.formControl}
                />
              </div>
            </div>
          </div>
        )}
        
        {asset.asset?.type === 'software' && (
          <div className={styles.formSection}>
            <h3>Software Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="licenseType">License Type</label>
                <select
                  id="licenseType"
                  name="licenseType"
                  value={(asset as any).licenseType || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                >
                  <option value="">- Select -</option>
                  <option value="perpetual">Perpetual</option>
                  <option value="subscription">Subscription</option>
                  <option value="open source">Open Source</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="licenseKey">License Key</label>
                <input
                  id="licenseKey"
                  name="licenseKey"
                  type="text"
                  value={(asset as any).licenseKey || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="version">Version</label>
                <input
                  id="version"
                  name="version"
                  type="text"
                  value={(asset as any).version || ''}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="supportExpirationDate">Support Expiration</label>
                <input
                  id="supportExpirationDate"
                  name="supportExpirationDate"
                  type="date"
                  value={(asset as any).supportExpirationDate ? 
                    new Date((asset as any).supportExpirationDate).toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="totalLicenses">Total Licenses</label>
                <input
                  id="totalLicenses"
                  name="totalLicenses"
                  type="number"
                  value={(asset as any).totalLicenses || ''}
                  onChange={handleNumberChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="usedLicenses">Used Licenses</label>
                <input
                  id="usedLicenses"
                  name="usedLicenses"
                  type="number"
                  value={(asset as any).usedLicenses || ''}
                  onChange={handleNumberChange}
                  className={styles.formControl}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.formSection}>
          <h3>Additional Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={asset.asset?.notes || ''}
                onChange={handleInputChange}
                className={styles.formControl}
                rows={4}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryEditForm;