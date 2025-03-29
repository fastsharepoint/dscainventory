import * as React from 'react';
import { useState } from 'react';
import styles from './DscaInventoryGantt.module.scss';
import DscaInventoryGanttControl from './DscaInventoryGanttControl';
import DscaInventoryGanttStatic from './DscaInventoryGanttStatic';

import type { IDscaInventoryGanttProps } from './IDscaInventoryGanttProps';

type ViewType = null | 'control' | 'static';

const DscaInventoryGantt: React.FC<IDscaInventoryGanttProps> = (props) => {
  const { context } = props;
  const [activeView, setActiveView] = useState<ViewType>(null);

  // Handler to go back to main view (passed to child components)
  const handleBack = () => {
    setActiveView(null);
  };

  // Select view handlers
  const handleSelectControl = () => {
    setActiveView('control');
  };

  const handleSelectStatic = () => {
    setActiveView('static');
  };

  // Render the content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'control':
        return <DscaInventoryGanttControl context={context} onBack={handleBack} />;
      case 'static':
        return <DscaInventoryGanttStatic context={context} onBack={handleBack} />;
      default:
        return (
          <div className={styles.viewSelector}>
            <h2>IT Asset End-of-Life Dashboard</h2>
            <p className={styles.description}>
              Select a view to visualize your IT asset end-of-life data.
            </p>
            
            <div className={styles.buttonContainer}>
              <button 
                className={styles.viewButton} 
                onClick={handleSelectControl}
                aria-label="Interactive Gantt Chart View"
              >
                <div className={styles.buttonIcon}>📊</div>
                <div className={styles.buttonContent}>
                  <h3>Interactive Chart</h3>
                  <p>View and interact with asset timelines in Gantt chart format</p>
                </div>
              </button>
              
              <button 
                className={styles.viewButton} 
                onClick={handleSelectStatic}
                aria-label="Monthly Calendar View"
              >
                <div className={styles.buttonIcon}>📅</div>
                <div className={styles.buttonContent}>
                  <h3>Monthly View</h3>
                  <p>See end-of-life dates in a monthly calendar format</p>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.dscaInventoryGantt}>
      {renderContent()}
    </div>
  );
};

export default DscaInventoryGantt;
