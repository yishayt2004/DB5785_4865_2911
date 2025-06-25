
CREATE TABLE Event (
    EventID SERIAL PRIMARY KEY,                        
    EventDate DATE NOT NULL,                            
    OrganizerEmployeeID INT NOT NULL,                   
    Location VARCHAR(100),                              
    CONSTRAINT fk_organizer FOREIGN KEY (OrganizerEmployeeID) REFERENCES Employee(EmployeeID)
);
