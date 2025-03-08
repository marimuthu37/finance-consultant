import React from "react";
import ConsultantList from "./ConsultantList";
import FullFeaturedCrudGrid from './Table';
import TripTracker from "./Trip";

function App() {
    return (
        <div>
             <FullFeaturedCrudGrid />
             <TripTracker />
             <ConsultantList />
        </div>
        
       
    );
}

export default App;
