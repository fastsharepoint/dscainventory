import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './DscaInventoryGantt.module.scss';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

export interface IDscaInventoryGanttControlProps {
  context: any;
  onBack: () => void;
}

interface IAssetItem {
  Id: number;
  Title: string;
  EndofLife: string;
}

const DscaInventoryGanttControl: React.FC<IDscaInventoryGanttControlProps> = (props) => {
  const { context, onBack } = props;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch inventory data from SharePoint
  const fetchInventoryData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Construct the API endpoint
      const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('FSInventory')/items?$select=Id,Title,EndofLife`;
      
      // Make the API call
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
        const errorDetails = await response.json();
        throw new Error(`Failed to fetch inventory data: ${response.statusText} ${errorDetails}`);
      }

      const data = await response.json();
      
      if (!data.value || !Array.isArray(data.value)) {
        throw new Error('Invalid data format received from SharePoint');
      }

      // Process the data for the Gantt chart
      const ganttTasks = processInventoryData(data.value);
      setTasks(ganttTasks);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Error fetching inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Process data from SharePoint into the format needed for Gantt
  const processInventoryData = (items: IAssetItem[]): Task[] => {
    // Current date for start date calculation
    const currentDate = new Date();
    
    // Create a root task to group all assets
    const rootTask: Task = {
      id: 'root',
      name: 'All Assets',
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear() + 3, 11, 31),
      progress: 0,
      type: 'project',
      hideChildren: false,
    };
    
    // Create tasks for each asset
    const assetTasks = items
      .filter(item => item.EndofLife) // Only process items with an EndofLife date
      .map(item => {
        // Parse the EndofLife date
        const endDate = new Date(item.EndofLife);
        
        // Calculate start date (1 months before end date)
        const startDate = new Date(endDate.getTime());
        startDate.setMonth(startDate.getMonth() - 1);
        
        console.log(getColorByTimeRemaining(endDate));
        // Create the task
        return {
          id: `asset-${item.Id}`,
          name: item.Title,
          start: startDate,
          end: endDate,
          progress: calculateProgress(startDate, endDate),
          type: 'task',
          project: 'root',
          styles: {
            progressColor: getColorByTimeRemaining(endDate),
            progressSelectedColor: '#ff9e0d',
          }
        } as Task;
      });
    
    // Return an array with the root task and all asset tasks
    return [rootTask, ...assetTasks];
  };
  
  // Calculate progress percentage based on current date between start and end
  const calculateProgress = (start: Date, end: Date): number => {
    const now = new Date();
    
    // If end date is in the past, progress is 100%
    if (now > end) return 100;
    
    // If start date is in the future, progress is 0%
    if (now < start) return 0;
    
    // Calculate percentage
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.round((current / total) * 100);
  };
  
  // Set color based on time remaining
  const getColorByTimeRemaining = (endDate: Date): string => {
    const now = new Date();
    const timeRemaining = endDate.getTime() - now.getTime();
    const monthsRemaining = timeRemaining / (1000 * 60 * 60 * 24 * 30.44); // Approximate months
    
    if (monthsRemaining < 0) return '#d13438'; // Past end date - red
    if (monthsRemaining < 3) return '#f1707b';  // Less than 3 months - light red
    if (monthsRemaining < 6) return '#ff8c00'; // Less than 6 months - orange
    if (monthsRemaining < 12) return '#ffd700'; // Less than 1 year - yellow
    return '#107c10'; // More than 1 year - green
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Custom header for the Gantt chart to show months/years
  const columnWidth = 60;
  const ganttHeight = 300;

  return (
    <div className={`${styles.dscaInventoryGantt}`}>
      <div className={styles.header}>
        {/* Add back button/link */}
        <div className={styles.backLinkContainer}>
          <button 
            className={styles.backLink}
            onClick={onBack}
            aria-label="Back to view selection"
          >
            ← Back to View Selection
          </button>
        </div>
        <h2>IT Asset End-of-Life Timeline</h2>
      </div>
      
      {isLoading && (
        <div className={styles.loading}>Loading inventory data...</div>
      )}
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      {!isLoading && !error && tasks.length > 0 && (
        <div className={styles.ganttContainer}>
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Month}
            listCellWidth="240px"
            columnWidth={columnWidth}
            ganttHeight={ganttHeight}
            todayColor="#0078d4"
            barCornerRadius={3}
            barFill={80}
            onClick={(task: Task) => console.log('Clicked:', task)}
            onDateChange={(task: Task, start: Date, end: Date) => {
              console.log('Date change:', task, start, end);
              // Here you could implement logic to update the SharePoint list
            }}
            onProgressChange={(task: Task, progress: number) => {
              console.log('Progress change:', task, progress);
              // Here you could implement logic to update progress
            }}
            onDoubleClick={(task: Task) => {
              console.log('Double clicked:', task);
              // Open task details or edit form
            }}
            onSelect={(task: Task) => console.log('Selected:', task)}
            preStepsCount={1} // For the left list part
          />
        </div>
      )}
      
      {!isLoading && !error && tasks.length <= 1 && (
        <div className={styles.noData}>No assets with end-of-life dates found.</div>
      )}
      
      <div className={styles.legend}>
        <h3>Timeline Legend</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.pastDue}`}></span>
            <span>Past Due</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.lessThan3Months}`}></span>
            <span>&lt; 3 Months</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.lessThan6Months}`}></span>
            <span>&lt; 6 Months</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.lessThan1Year}`}></span>
            <span>&lt; 1 Year</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.moreThan1Year}`}></span>
            <span>&gt; 1 Year</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DscaInventoryGanttControl;
