import * as React from 'react';
import { useState, useEffect } from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './DscaInventoryGanttStatic.module.scss';

export interface IDscaInventoryGanttStaticProps {
    context: any;
    onBack: () => void;
  }

interface IAssetItem {
  Id: number;
  Title: string;
  EndofLife: string;  // Date in ISO format
}

const DscaInventoryGanttStatic: React.FC<IDscaInventoryGanttStaticProps> = (props) => {
  const { context, onBack } = props;
  
  const [inventoryItems, setInventoryItems] = useState<IAssetItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<IAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch inventory data from SharePoint
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('FSInventory')/items?$select=Id,Title,EndofLife`;
        
        const response: SPHttpClientResponse = await context.spHttpClient.get(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'odata-version': ''
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.value || !Array.isArray(data.value)) {
          throw new Error('Invalid data format received from SharePoint');
        }

        const items: IAssetItem[] = data.value;
        setInventoryItems(items);
        
        // Extract all unique years from the EndofLife dates
        const years = items
          .filter(item => item.EndofLife) // Only items with EndofLife dates
          .map(item => new Date(item.EndofLife).getFullYear())
          .filter((year, index, self) => self.indexOf(year) === index) // Remove duplicates
          .sort((a, b) => a - b); // Sort ascending
        
        setAvailableYears(years);
        
        // If no years found or selected year not in years, default to current year
        if (years.length > 0 && years.indexOf(selectedYear) === -1) {
            setSelectedYear(years[0]);
          }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Error fetching inventory data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [context]);

  // Filter items when selected year changes or inventory items change
  useEffect(() => {
    if (inventoryItems.length > 0) {
      const filtered = inventoryItems.filter(item => {
        if (!item.EndofLife) return false;
        const eolYear = new Date(item.EndofLife).getFullYear();
        return eolYear === selectedYear;
      });
      setFilteredItems(filtered);
    }
  }, [selectedYear, inventoryItems]);

  // Check if an asset has EOL in a specific month
  const hasEolInMonth = (item: IAssetItem, month: number): boolean => {
    if (!item.EndofLife) return false;
    const eolDate = new Date(item.EndofLife);
    return eolDate.getFullYear() === selectedYear && eolDate.getMonth() === month;
  };
  
  // Get the day of the month for the EOL date
  const getEolDay = (item: IAssetItem, month: number): string => {
    if (!item.EndofLife) return '';
    const eolDate = new Date(item.EndofLife);
    if (eolDate.getFullYear() === selectedYear && eolDate.getMonth() === month) {
      return eolDate.getDate().toString();
    }
    return '';
  };

  // Handle year selection change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className={styles.dscaInventoryGanttStatic}>
      <div className={styles.header}>
        <div className={styles.backLinkContainer}>
          <button 
            className={styles.backLink}
            onClick={onBack}
            aria-label="Back to view selection"
          >
            ← Back to View Selection
          </button>
        </div>
        
        <div className={styles.headerContent}>
          <h2>IT Asset End-of-Life Monthly View</h2>
          
          <div className={styles.filterContainer}>
            <label htmlFor="yearFilter" className={styles.filterLabel}>
              Filter by End-of-Life Year:
            </label>
            <select 
              id="yearFilter" 
              value={selectedYear}
              onChange={handleYearChange}
              className={styles.yearFilter}
              disabled={isLoading || availableYears.length === 0}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className={styles.loading}>Loading inventory data...</div>
      )}
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      {!isLoading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <div className={styles.noData}>No assets with End-of-Life dates found for {selectedYear}.</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.eolTable}>
                <thead>
                  <tr>
                    <th className={styles.assetColumn}>Asset</th>
                    {months.map(month => (
                      <th key={month} className={styles.monthColumn}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.Id}>
                      <td className={styles.assetCell}>{item.Title}</td>
                      {months.map((month, index) => (
                        <td 
                          key={`${item.Id}-${month}`}
                          className={`${styles.monthCell} ${hasEolInMonth(item, index) ? styles.eolCell : ''}`}
                        >
                          {getEolDay(item, index)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      <div className={styles.footer}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.eolIndicator}></span>
            <span>End-of-Life Date</span>
          </div>
        </div>
        <div className={styles.totalAssets}>
          Total Assets: {filteredItems.length}
        </div>
      </div>
    </div>
  );
};

export default DscaInventoryGanttStatic;